import torch
from torch.utils.data import DataLoader, TensorDataset
from torch import nn
from transformers import BertTokenizer, BertModel, AdamW
import pandas as pd
from tqdm import tqdm

# Load the data
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

train_dataset = load_data("train.csv")
test_dataset = load_data("test.csv")

train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=16)

# Create the model
class BertForRegression(nn.Module):
    def __init__(self):
        super().__init__()
        self.bert = BertModel.from_pretrained("bert-base-uncased")
        self.regressor = nn.Linear(self.bert.config.hidden_size, 1)

    def forward(self, input_ids, attention_mask):
        pooled_output = self.bert(input_ids=input_ids, attention_mask=attention_mask).pooler_output
        return self.regressor(pooled_output).squeeze(-1)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = BertForRegression().to(device)

# Train the model
optimizer = AdamW(model.parameters(), lr=2e-5)
criterion = nn.MSELoss()
num_epochs = 3

for epoch in range(num_epochs):
    model.train()
    total_loss = 0
    for input_ids, attention_mask, labels in tqdm(train_loader, desc=f"Epoch {epoch+1}"):
        input_ids = input_ids.to(device)
        attention_mask = attention_mask.to(device)
        labels = labels.to(device)

        optimizer.zero_grad()
        outputs = model(input_ids, attention_mask)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        total_loss += loss.item()
    print(f"Epoch {epoch+1} Loss: {total_loss/len(train_loader):.4f}")

# Evaluate the model
model.eval()
mse_total = 0
with torch.no_grad():
    for input_ids, attention_mask, labels in test_loader:
        input_ids = input_ids.to(device)
        attention_mask = attention_mask.to(device)
        labels = labels.to(device)

        outputs = model(input_ids, attention_mask)
        mse_total += criterion(outputs, labels).item() * input_ids.size(0)

mse_total /= len(test_dataset)
print(f"Test MSE: {mse_total:.4f}")

# Save the model
model.save_pretrained("./bert_sentiment_regression")
tokenizer.save_pretrained("./bert_sentiment_regression")