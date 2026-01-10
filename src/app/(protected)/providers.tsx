"use client";

import { TransactionsProvider } from "@/contexts/TransactionsContext";

export default function ProtectedProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TransactionsProvider>{children}</TransactionsProvider>;
}
