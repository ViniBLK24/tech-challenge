"use client";

import Image from "next/image";
import { useEffect } from "react";
import { TransactionForm } from "./TransactionForm";
import { useTransactionForm } from "@/hooks/useTransactionForm";
import { useTransactionFile } from "@/hooks/useTransactionFile";
import { editTransaction, deleteTransaction } from "@/utils/api";
import { Transaction, TransactionTypeEnum } from "@/types/transactions";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import BackgroundShapes from "./ui/BackgroundShapes";
import Modal from "./ui/Modal";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { ERROR_CODES } from "@/constants/errors";
import { ErrorCodeEnum } from "@/types/apiErrors";
import { useTransactions } from "@/contexts/TransactionsContext";

type Props = {
  transaction?: Transaction;
  onClose: () => void;
};

export function EditTransactionModal({ transaction, onClose }: Props) {
  if (!transaction) return null;

  const { toast } = useToast();
  const { refresh } = useTransactions();

  const { formData, setFormData, handleChange, resetForm } =
    useTransactionForm();

  const {
    file,
    previewUrl,
    shouldRemoveFile,
    handleFileDrop,
    removeFile,
    resetFile,
  } = useTransactionFile(transaction.fileUrl);

  useEffect(() => {
    setFormData({
      type: transaction.type,
      amount: currencyFormatter(String(transaction.amount)),
      description: transaction.description ?? "",
      category: transaction.category ?? "",
    });
  }, [transaction, setFormData]);

  async function handleSubmit() {
    try {
      const payload: Transaction = {
        ...transaction,
        type: formData.type as TransactionTypeEnum,
        amount: parseInt(formData.amount.replace(/\D/g, "")),
        description: formData.description || undefined,
        category: formData.category || undefined,
      };

      const response = await editTransaction(payload, shouldRemoveFile, file);

      if (response.transactions) {
        resetForm();
        resetFile();
        onClose();
        refresh();

        toast({
          title: "Sucesso!",
          description: "Transação concluída.",
          variant: "success",
        });
      } else {
        const code = response.errorCode as ErrorCodeEnum;
        toast({
          title: ERROR_CODES[code].title,
          description: ERROR_CODES[code].desc,
          variant: "warning",
        });
      }
    } catch {
      toast({
        title: "Algo deu errado.",
        description: "Falha na operação de editar.",
        variant: "destructive",
      });
    }
  }

  return (
    <Modal onClose={onClose}>
      <Card className="bg-[#F5F5F5] relative pt-5 pb-0 md:pb-[2.5rem] md:min-w-[600px] lg:w-[800px]">
        <BackgroundShapes y="top-0" x="right-0" />
        <BackgroundShapes y="bottom-0" x="left-0" />

        <div className="flex flex-col md:px-5 md:gap-4">
          <CardHeader>
            <CardTitle className="text-3xl">Alterar Transação</CardTitle>
            <CardDescription>
              <span className="text-destructive">*</span> Itens obrigatórios
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-8">
            <TransactionForm
              isEditing
              formData={formData}
              uploadedImageUrl={previewUrl}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onCancelEdit={onClose}
              onFileDrop={handleFileDrop}
              onRemoveFile={removeFile}
            />

            <Image
              src="/ilustracao-nova-transacao.svg"
              alt="Ilustração"
              width={300}
              height={300}
              className="pointer-events-none md:absolute md:right-5 md:bottom-5"
            />
          </CardContent>
        </div>
      </Card>
    </Modal>
  );
}
