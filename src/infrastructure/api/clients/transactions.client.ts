import { Transaction } from "@/domain/entities";

const API_URL = "/api/transactions";

export class TransactionsClient {
  async create(transaction: Transaction, file?: File): Promise<any> {
    const formData = new FormData();
    formData.append("type", transaction.type);
    formData.append("amount", transaction.amount.toString());
    
    if (transaction.userId) {
      formData.append("userId", transaction.userId.toString());
    }

    if (file) {
      formData.append("file", file);
    }

    (["description", "category"] as const).forEach((key) => {
      const value = transaction[key];
      if (value) {
        formData.append(key, value.toString());
      }
    });

    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    return response.json();
  }

  async getAll(userId: string): Promise<any> {
    const response = await fetch(`${API_URL}?userId=${userId}`);
    return response.json();
  }

  async update(transaction: Transaction, removeFile: boolean, file?: File): Promise<any> {
    const formData = new FormData();
    formData.append("type", transaction.type);
    formData.append("amount", transaction.amount.toString());
    formData.append("id", transaction.id!.toString());
    formData.append("removeFile", removeFile ? "true" : "false");

    if (file) {
      formData.append("file", file);
    }

    (["description", "category"] as const).forEach((key) => {
      const value = transaction[key];
      if (value) {
        formData.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_URL}?id=${transaction.id}`, {
      method: "PUT",
      body: formData,
    });

    return response.json();
  }

  async delete(id: number): Promise<any> {
    const formData = new FormData();
    formData.append("id", id.toString());

    const response = await fetch(API_URL, {
      method: "DELETE",
      body: formData,
    });

    return response.json();
  }
}

