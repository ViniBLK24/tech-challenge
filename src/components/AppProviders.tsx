"use client";

import { EditTransactionProvider } from "@/contexts/EditTransactionContext";
import { TransactionsProvider } from "@/contexts/TransactionsContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <TransactionsProvider>
      <EditTransactionProvider>{children}</EditTransactionProvider>
    </TransactionsProvider>
  );
}
