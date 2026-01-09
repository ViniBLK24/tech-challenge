import { Transaction } from "@/domain/entities";
import { TransactionsClient } from "@/infrastructure/api/clients/transactions.client";

const transactionsClient = new TransactionsClient();

import { getAccountData as getAccountDataFromUsers } from "./users.api";

async function getAccountData(): Promise<{ userId: string }> {
  const accountData = await getAccountDataFromUsers();
  return { userId: accountData.userId };
}

export async function createTransaction(transaction: Transaction, file?: File) {
  const accountData = await getAccountData();
  const userId = accountData.userId;
  
  return transactionsClient.create({ ...transaction, userId }, file);
}

export async function getTransactions() {
  const accountData = await getAccountData();
  const userId = accountData.userId;
  
  return transactionsClient.getAll(userId);
}

export async function editTransaction(transaction: Transaction, removeFile: boolean, file?: File) {
  return transactionsClient.update(transaction, removeFile, file);
}

export async function deleteTransaction(transaction: Transaction) {
  return transactionsClient.delete(transaction.id!);
}

