"use client";

import { TransactionsProvider } from "@/contexts/TransactionsContext";

export default function TransactionsProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TransactionsProvider>{children}</TransactionsProvider>;
}
