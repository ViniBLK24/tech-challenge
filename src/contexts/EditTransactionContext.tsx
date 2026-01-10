"use client";

import { createContext, useContext, useState } from "react";
import { Transaction } from "@/types/transactions";
import { EditTransactionModal } from "@/presentation/components/EditTransactionModal";

type EditTransactionContextType = {
  openEdit: (transaction: Transaction) => void;
  closeEdit: () => void;
};

const EditTransactionContext = createContext<
  EditTransactionContextType | undefined
>(undefined);

export function EditTransactionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  function openEdit(transaction: Transaction) {
    setTransaction(transaction);
    setIsOpen(true);
  }

  function closeEdit() {
    setIsOpen(false);
    setTransaction(null);
  }

  return (
    <EditTransactionContext.Provider value={{ openEdit, closeEdit }}>
      {children}

      {isOpen && transaction && (
        <EditTransactionModal transaction={transaction} onClose={closeEdit} />
      )}
    </EditTransactionContext.Provider>
  );
}

export function useEditTransaction() {
  const context = useContext(EditTransactionContext);
  if (!context) {
    throw new Error(
      "useEditTransaction must be used inside EditTransactionProvider"
    );
  }
  return context;
}
