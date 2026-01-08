"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Transaction } from "@/types/transactions";
import {
  getTransactions,
  deleteTransaction as apiDelete,
  editTransaction as apiEdit,
  createTransaction as apiCreate,
} from "@/utils/api";
import getTotalBalance from "@/utils/getTotalBalance";

type UpdateTransactionOptions = {
  file?: File | null;
  shouldRemoveFile?: boolean;
};

type TransactionsContextType = {
  transactions: Transaction[];
  totalBalance: number;
  refresh: () => Promise<void>;
  createTransaction: (
    transaction: Transaction,
    file?: File
  ) => Promise<boolean>;
  deleteTransaction: (transaction: Transaction) => Promise<void>;
  updateTransaction: (
    transaction: Transaction,
    options?: UpdateTransactionOptions
  ) => Promise<void>;
};

const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined
);

export function TransactionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);

  async function refresh() {
    const data = await getTransactions();
    setTransactions(data.transactions);
    setTotalBalance(getTotalBalance(data.transactions));
  }

  async function createTransaction(transaction: Transaction, file?: File) {
    try {
      const response = await apiCreate(transaction, file);
      return response;
    } catch (err) {
      console.error("Create transaction failed:", err);
      return false;
    }
  }

  async function deleteTransaction(transaction: Transaction) {
    await apiDelete(transaction);
    await refresh();
  }

  async function updateTransaction(
    transaction: Transaction,
    options?: UpdateTransactionOptions
  ) {
    await apiEdit(
      transaction,
      options?.shouldRemoveFile ?? false,
      options?.file ?? undefined
    );

    await refresh();
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        totalBalance,
        refresh,
        createTransaction,
        deleteTransaction,
        updateTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error("useTransactions must be used inside TransactionsProvider");
  }
  return context;
}
