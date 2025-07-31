import { Transaction } from "@/types/transactions";
import getCurrentUserId from "./getCurrentUserId";

const API_URL = "/api/transactions";

export async function createTransaction(transaction: Transaction, file?: File) {
  const userId = getCurrentUserId();

  const formData = new FormData();
  formData.append("type", transaction.type);
  formData.append("amount", transaction.amount.toString());
  formData.append("userId", userId.toString());

  if (file) {
    formData.append("file", file);
  }

  const response = await fetch("/api/transactions", {
    method: "POST",
    body: formData,
  });

  return response.json();
}

export async function getTransactions() {
  const userId = getCurrentUserId();
  const response = await fetch(`${API_URL}?userId=${userId}`);
  return response.json();
}

export async function editTransaction(transaction: Transaction, removeFile: boolean, file?: File) {
  const formData = new FormData();
  formData.append("type", transaction.type);
  formData.append("amount", transaction.amount.toString());
  formData.append("id", transaction.id!.toString()); // assume id exists for edit
  formData.append("removeFile", removeFile ? "true" : "false");

  // Append file to formData if it exists
  if (file) {
    formData.append("file", file);
  }

  const response = await fetch(`/api/transactions?id=${transaction.id}`, {
    method: "PUT",
    body: formData,
  });

  return response.json();
}

export async function deleteTransaction(transaction: Transaction) {
  console.log("api")
  const formData = new FormData();
  formData.append("id", transaction.id!.toString());

  const response = await fetch("/api/transactions", {
    method: "DELETE",
    body: formData,
  });

  return response.json();
}
