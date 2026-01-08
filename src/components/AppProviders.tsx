"use client";

import { EditTransactionProvider } from "@/contexts/EditTransactionContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <EditTransactionProvider>{children}</EditTransactionProvider>;
}
