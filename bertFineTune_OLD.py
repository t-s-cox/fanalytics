import torch
from torch.utils.data import DataLoader, TensorDataset, Subset
from torch import nn
from transformers import BertTokenizer, BertModel, AdamW
import pandas as pd
from sklearn.model_selection import KFold, train_test_split
from tqdm import tqdm

# ---------------------------
# 1. Load and tokenize data
# ---------------------------
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
max_length = 128

def load_data(csv_file):
    df = pd.read_csv(csv_file)
    texts = df["text"].tolist()
    labels = torch.tensor(df["label"].tolist(), dtype=torch.float)

    encodings = tokenizer(
        texts,
        padding=True,
        truncation=True,
        max_length=max_length,
        return_tensors="pt"
    )
    dataset = TensorDataset(encodings["input_ids"], encodings["attention_mask"], labels)
    return dataset

dataset = load_data("all_data.csv")  # single CSV with all samples

# ---------------------------
# 2. Define regression model
# ---------------------------
class BertForRegression(nn.Module):
    def __init__(self):
        super().__init__()
        self.bert = BertModel.from_pretrained("bert-base-uncased")
        self.regressor = nn.Linear(self.bert.config.hidden_size, 1)

    def forward(self, input_ids, attention_mask):
        pooled_output = self.bert(input_ids=input_ids, attention_mask=attention_mask).pooler_output
        return self.regressor(pooled_output).squeeze(-1)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ---------------------------
# 3. Train/test split (80/20) + K-Fold CV
# ---------------------------
def run_training(dataset, k_folds=5, num_epochs=3, batch_size=16):
    kfold = KFold(n_splits=k_folds, shuffle=True, random_state=42)

    fold_results = []

    for fold, (train_ids, test_ids) in enumerate(kfold.split(dataset)):
        print(f"\n----- Fold {fold+1} / {k_folds} -----")

        train_subsampler = Subset(dataset, train_ids)
        test_subsampler = Subset(dataset, test_ids)

        train_loader = DataLoader(train_subsampler, batch_size=batch_size, shuffle=True)
        test_loader = DataLoader(test_subsampler, batch_size=batch_size)

        model = BertForRegression().to(device)
        optimizer = AdamW(model.parameters(), lr=2e-5)
        criterion = nn.MSELoss()

        # Training
        for epoch in range(num_epochs):
            model.train()
            total_loss = 0
            for input_ids, attention_mask, labels in tqdm(train_loader, desc=f"Fold {fold+1} Epoch {epoch+1}"):
                input_ids, attention_mask, labels = input_ids.to(device), attention_mask.to(device), labels.to(device)

                optimizer.zero_grad()
                outputs = model(input_ids, attention_mask)
                loss = criterion(outputs, labels)
                loss.backward()
                optimizer.step()

                total_loss += loss.item()
            print(f"Fold {fold+1} Epoch {epoch+1} Train Loss: {total_loss/len(train_loader):.4f}")

        # Evaluation
        model.eval()
        mse_total = 0
        with torch.no_grad():
            for input_ids, attention_mask, labels in test_loader:
                input_ids, attention_mask, labels = input_ids.to(device), attention_mask.to(device), labels.to(device)
                outputs = model(input_ids, attention_mask)
                mse_total += criterion(outputs, labels).item() * input_ids.size(0)

        mse_total /= len(test_subsampler)
        fold_results.append(mse_total)
        print(f"Fold {fold+1} Test MSE: {mse_total:.4f}")

    avg_mse = sum(fold_results) / len(fold_results)
    print(f"\n==== Cross-validation MSE across {k_folds} folds: {avg_mse:.4f} ====")

    # Save last model + tokenizer
    model.save_pretrained("./bert_sentiment_regression")
    tokenizer.save_pretrained("./bert_sentiment_regression")

run_training(dataset, k_folds=5, num_epochs=3)