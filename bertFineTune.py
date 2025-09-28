import torch
print(torch.__version__)
from transformers import BertTokenizer, BertForSequenceClassification


# # ------------------------
# # CONFIGURATION
# # ------------------------
# weights_path = "BERT/model.safetensors"  # your safetensors file
# bert_variant = "bert-base-uncased"          # BERT variant
# text = "Hello, BERT is running on CPU!"

# # ------------------------
# # TOKENIZER
# # ------------------------
# tokenizer = BertTokenizer.from_pretrained(bert_variant)

# # ------------------------
# # LOAD MODEL (CPU only)
# # ------------------------
# device = torch.device("cpu")

# model = BertForSequenceClassification.from_pretrained(
#     bert_variant,
#     safe_serialization=weights_path,  # load safetensors weights
# )
# model.to(device)
# model.eval()

# # ------------------------
# # TOKENIZE INPUT
# # ------------------------
# inputs = tokenizer(text, return_tensors="pt")
# inputs = {k: v.to(device) for k, v in inputs.items()}

# # ------------------------
# # RUN MODEL
# # ------------------------
# with torch.no_grad():
#     outputs = model(**inputs)

# # ------------------------
# # GET LOGITS
# # ------------------------
# logits = outputs.logits
# print("Logits:", logits)
