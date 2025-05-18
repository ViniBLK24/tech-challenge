import { Transaction } from "@/types/transactions";

const API_URL = "/api/transactions";

export async function createTransaction(transaction: Transaction) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(transaction)
    });
    return response.json();
}

export async function getTransactions(){
    const response = await fetch(API_URL);
    return response.json();
}