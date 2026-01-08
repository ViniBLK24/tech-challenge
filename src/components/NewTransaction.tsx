"use client";

import Image from "next/image";
import { TransactionForm } from "./TransactionForm";
import { useTransactionForm } from "../hooks/useTransactionForm";
import { useTransactionFile } from "../hooks/useTransactionFile";
import { TransactionTypeEnum, Transaction } from "@/types/transactions";
import { useToast } from "@/hooks/use-toast";
import { useTransactions } from "@/contexts/TransactionsContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import BackgroundShapes from "./ui/BackgroundShapes";
import { ERROR_CODES } from "@/constants/errors";
import { ErrorCodeEnum } from "@/types/apiErrors";

export function NewTransaction() {
  const { toast } = useToast();
  const { createTransaction, refresh } = useTransactions();

  const { formData, handleChange, resetForm } = useTransactionForm();

  const { file, previewUrl, handleFileDrop, removeFile, resetFile } =
    useTransactionFile();

  async function handleSubmit() {
    const amount = parseInt(formData.amount.replace(/\D/g, ""));

    if (!formData.type || !amount) {
      toast({
        title: "Campos obrigatórios!",
        description: "Preencha todos os campos.",
        variant: "warning",
        duration: 4000,
      });
      return;
    }

    const payload: Transaction = {
      type: formData.type as TransactionTypeEnum,
      amount,
      createdAt: new Date().toISOString(),
      description: formData.description || undefined,
      category: formData.category || undefined,
    };

    try {
      const response = await createTransaction(payload, file ?? undefined);

      if (response.transactions) {
        resetForm();
        resetFile();
        refresh();

        toast({
          title: "Sucesso!",
          description: "Transação concluída.",
          variant: "success",
          duration: 4000,
        });
      } else {
        const code = response.errorCode as ErrorCodeEnum;
        toast({
          title: ERROR_CODES[code].title,
          description: ERROR_CODES[code].desc,
          variant: "warning",
        });
      }
    } catch (err: any) {
      toast({
        title: "Algo deu errado",
        description: err?.message ?? "Falha ao criar transação",
        variant: "destructive",
        duration: 4000,
      });
    }
  }

  return (
    <Card className="bg-[#F5F5F5] relative pt-5 pb-0 md:pb-[2.5rem] w-auto">
      <BackgroundShapes y="top-0" x="right-0" />
      <BackgroundShapes y="bottom-0" x="left-0" />

      <div className="flex flex-col md:w-[100%] md:px-5 md:gap-4">
        <CardHeader className="flex flex-col items-center md:items-start">
          <CardTitle className="text-3xl">Nova Transação</CardTitle>
          <CardDescription>
            <span className="text-destructive">*</span> Itens obrigatórios
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-[2rem]">
          <TransactionForm
            formData={formData}
            uploadedImageUrl={previewUrl}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onFileDrop={handleFileDrop}
            onRemoveFile={removeFile}
          />

          <Image
            src="/ilustracao-nova-transacao.svg"
            alt="Ilustração de uma mulher segurando um cartão de crédito"
            height={300}
            width={300}
            className="z-0 pointer-events-none -mb-5 md:absolute md:right-5 md:bottom-5"
          />
        </CardContent>
      </div>
    </Card>
  );
}
