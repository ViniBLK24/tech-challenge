"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch current user
  useEffect(() => {
    async function fetchAccountData() {
      try {
        const response = await fetch("/api/account");
        const data = await response.json();

        if (!response.ok) {
          console.error("Error fetching account data:", data?.error);
          return;
        }

        const userId = data?.result?.account?.[0]?.userId ?? null;
        console.log("Current user id:", userId);

        setCurrentUserId(userId);
      } catch (error) {
        console.error("Failed to fetch account data:", error);
      }
    }

    fetchAccountData();
  }, []);

  //  Refresh transaction for current user
  const refresh = useCallback(async () => {
    if (!currentUserId) return;

    const data = await getTransactions();

    const userTransactions = data.transactions.filter(
      (transaction: Transaction) => transaction.userId === currentUserId
    );
    console.log("UserTransaction:", userTransactions);

    setTransactions(userTransactions);
    setTotalBalance(getTotalBalance(userTransactions));
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;
    refresh();
  }, [currentUserId, refresh]);

  async function createTransaction(transaction: Transaction, file?: File) {
    try {
      const success = await apiCreate(transaction, file);
      if (success) await refresh();
      return success;
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
