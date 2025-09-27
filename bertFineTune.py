from transformers import BertTokenizer, BertForSequenceClassification, Trainer, TrainingArguments
from datasets import load_dataset

def main():
    tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

    dataset = load_dataset(".csv", data_files={"train": "train.csv", "test": "test.csv"})
    encoded_dataset = dataset.map(lambda batch:tokenizer(batch["text"], padding="max_length", truncation=True), batched=True)
    model = BertForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=2)

    training_args = TrainingArguments(
        output_dir="./results",
        evaluation_strategy="epoch",
        learning_rate=2e-5,
        per_device_train_batch_size=16,
        num_train_epochs=3,
        weight_decay=0.01,
        logging_dir='./logs',
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=encoded_dataset["train"],
        eval_dataset=encoded_dataset["test"],
    )

    trainer.train()
    trainer.save_model("./bertFineTuned")
    tokenizer.save_pretrained("./bertFinetuned")

if __name__ == "__main__":
    main()