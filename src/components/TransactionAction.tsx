"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button, buttonVariants } from "./ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { cn } from "@/lib/utils";
import Image from "next/image";
import BackgroundShapes from "./ui/BackgroundShapes";
import { TransactionTypeEnum, Transaction } from "@/types/transactions";
import { useEffect, useState } from "react";
import {
  createTransaction,
  deleteTransaction,
  editTransaction,
} from "@/utils/api";
import { Toaster } from "./ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { ErrorCodeEnum } from "@/types/apiErrors";
import { ERROR_CODES } from "@/constants/errors";
import { currencyFormatter } from "@/utils/currencyFormatter";
import getCurrentUserId from "@/utils/getCurrentUserId";

type Props = {
  transaction?: Transaction | null;
  isEditing?: boolean;
  onComplete: (isEditing: boolean) => void;
  transactions?: Transaction[];
};

export default function TransactionActions({
  transaction = null,
  isEditing = false,
  onComplete,
}: Props) {
  const { toast } = useToast();

  const [formData, setFormData] = useState<{
    id?: number;
    type: string;
    amount: string;
  }>({
    id: undefined,
    type: transaction?.type || "",
    amount: "",
  });

  useEffect(() => {
    if (transaction && isEditing) {
      // If editing, populate the form with the transaction data
      setFormData({
        id: transaction.id ?? 0,
        type: transaction.type || "",
        amount: transaction.amount ? String(transaction.amount) : "",
      });
    } else if (transaction && !isEditing) {
      handleDeleteTransaction(transaction);
    }
  }, [transaction]);

  function handleChange(field: string, value: string): void {
    if (field === "amount") {
      const amount = currencyFormatter(value + "");
      value = amount;
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleDeleteTransaction(transaction: Transaction) {
    console.log("Delete");
    try {
      const response = await deleteTransaction(transaction);

      if (response.transactions) {
        setFormData({
          type: "",
          amount: "",
        });

        onComplete(false);
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
          duration: 4000,
        });
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Algo deu errado.",
        description: "Falha na operação.",
        variant: "destructive",
        duration: 4000,
      });
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const removedSpecialCharacters = formData.amount.replace(/\D/g, "");

    if (!formData.type || !removedSpecialCharacters) {
      toast({
        title: "Campos obrigatórios!",
        description: "Preencha todos os campos.",
        variant: "warning",
        duration: 4000,
      });
      return;
    }

    const createdAt =
      isEditing && transaction
        ? transaction.createdAt
        : new Date().toISOString();

    const transactionData: Transaction = {
      type: formData.type as TransactionTypeEnum,
      amount: parseInt(removedSpecialCharacters),
      createdAt,
      id: formData.id,
    };

    if (!isEditing) {
      handleCreateTransaction(transactionData);
    } else {
      handleEditTransaction(transactionData);
    }

    async function handleCreateTransaction(transactionData: Transaction) {
      try {
        const response = await createTransaction(transactionData);

        if (response.transactions) {
          setFormData({
            type: "",
            amount: "",
          });

          onComplete(false);
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
            duration: 4000,
          });
        }
      } catch (err) {
        console.log(err);
        toast({
          title: "Algo deu errado.",
          description: "Falha na operação.",
          variant: "destructive",
          duration: 4000,
        });
      }
    }

    async function handleEditTransaction(transactionData: Transaction) {
      try {
        const response = await editTransaction(transactionData);

        if (response.transactions) {
          setFormData({
            type: "",
            amount: "",
          });

          onComplete(false);

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
            duration: 4000,
          });
        }
      } catch (err) {
        console.log(err);
        toast({
          title: "Algo deu errado.",
          description: "Falha na operação.",
          variant: "destructive",
          duration: 4000,
        });
      }
    }
  };
  return (
    <Card className="bg-[#F5F5F5] relative pt-5 pb-0 md:h-[490px]">
      <BackgroundShapes y="top-0" x="right-0" />

      <BackgroundShapes y="bottom-0" x="left-0" />

      <div className="flex flex-col md:w-[60%] md:px-5 md:gap-4 lg:w-[55%]">
        <CardHeader className="flex flex-col items-center md:items-start">
          <CardTitle className="text-3xl">
            {" "}
            {isEditing ? "Alterar Transação" : "Nova Transação"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Transaction form */}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-y-8 mt-3 md:mt-0"
          >
            <Select
              value={formData.type}
              onValueChange={(value) => handleChange("type", value)}
            >
              <SelectTrigger
                value={formData.type}
                className="w-[100%] z-1 cursor-pointer"
              >
                <SelectValue placeholder="Selecione o tipo de transação" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem
                  value={TransactionTypeEnum.TRANSFER}
                  className="cursor-pointer"
                >
                  Transferência
                </SelectItem>

                <SelectItem
                  value={TransactionTypeEnum.DEPOSIT}
                  className="cursor-pointer"
                >
                  Depósito
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="flex flex-col gap-y-3">
              <Label htmlFor="valor" className="">
                Valor
              </Label>

              <Input
                id="valor"
                type="text"
                min="0"
                step="0.01"
                value={currencyFormatter(formData.amount)}
                onChange={(e) => handleChange("amount", e.target.value)}
                className="w-[50%] md:w-[100%]"
                placeholder="00,00"
              />
            </div>

            <Button
              type="submit"
              className={cn(
                buttonVariants({ size: "lg" }),

                "bg-black text-white w-[100%] cursor-pointer hover:text-white hover:bg-neutral-500 md:w-[70%] md:min-w-50"
              )}
            >
              {isEditing ? "Salvar alterações" : "Concluir transação"}
            </Button>

            <Toaster />
          </form>

          <Image
            src="/ilustracao-nova-transacao.svg"
            alt="Ilustração de uma mulher segurando um cartão de crédito"
            height={300}
            width={300}
            className="z-0 pointer-events-none -mb-5 md:hidden"
          ></Image>
        </CardContent>
      </div>

      <div className="hidden md:block md:absolute md:w-85 md:h-60 md:bottom-0 md:right-6 md:min-w-[50%] lg:right-10 lg:w-95 lg:h-65">
        <Image
          src="/ilustracao-nova-transacao.svg"
          alt="Ilustração de uma mulher segurando um cartão de crédito"
          fill
          className="z-0 pointer-events-none"
        ></Image>
      </div>
    </Card>
  );
}
