import { Transaction } from "@/types/transactions";
import getCurrentUserId from "./getCurrentUserId";

const API_URL = "/api/transactions";

export async function createTransaction(transaction: Transaction) {
  try {
    const userId = getCurrentUserId();
    const response = await fetch(`${API_URL}?userId=${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaction),
    });
    return response.json();
  } catch {
    
  }
}

export async function getTransactions() {
  const userId = getCurrentUserId();
  const response = await fetch(`${API_URL}?userId=${userId}`);
  return response.json();
}

export async function editTransaction(transaction: Transaction) {
  const userId = getCurrentUserId();
  const response = await fetch(`${API_URL}?userId=${userId}&id=${transaction.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transaction),
  });
  return response.json();
}

export async function deleteTransaction(transaction: Transaction) {
  const userId = getCurrentUserId();
  const response = await fetch(`${API_URL}?userId=${userId}` + "?id=" + transaction.id, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
}
