"use client";

import { useState } from "react";
import { currencyFormatter } from "@/shared/lib/currencyFormatter";
import { suggestCategory } from "@/utils/suggestCategory";

export type TransactionFormData = {
  type: string;
  amount: string;
  description: string;
  category: string;
};

export function useTransactionForm(
  initialData?: Partial<TransactionFormData>
) {
  const [formData, setFormData] = useState<TransactionFormData>({
    type: initialData?.type ?? "",
    amount: initialData?.amount ?? "",
    description: initialData?.description ?? "",
    category: initialData?.category ?? "",
  });

  function handleChange(
    field: keyof TransactionFormData,
    value: string
  ) {
    if (field === "amount") {
      value = currencyFormatter(value);
    }

    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "description") {
        const suggested = suggestCategory(value);
        if (suggested) {
          updated.category = suggested;
        }
      }

      return updated;
    });
  }

  function resetForm() {
    setFormData({
      type: "",
      amount: "",
      description: "",
      category: "",
    });
  }

  return {
    formData,
    setFormData,
    handleChange,
    resetForm,
  };
}
