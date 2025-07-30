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
import { X, CloudUpload, MoveLeft } from "lucide-react";
import { useDropzone } from "react-dropzone";

type Props = {
  transaction?: Transaction | null;
  isEditing?: boolean;
  onComplete: (isEditing: boolean) => void;
  transactions?: Transaction[];
  onCancelEditing?: (cancel: boolean) => void;
};

export default function TransactionActions({
  transaction = null,
  isEditing = false,
  onComplete,
  onCancelEditing,
}: Props) {
  const { toast } = useToast();

  const [formData, setFormData] = useState<{
    id?: number;
    type: string;
    amount: string;
    fileUrl: string;
  }>({
    id: undefined,
    type: transaction?.type || "",
    amount: "",
    fileUrl: "",
  });

  const [file, setFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [shouldRemoveFile, setShouldRemoveFile] = useState(false);

  // Dropzone logic
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [], "application/pdf": [] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFile(file);
        const previewUrl = URL.createObjectURL(file);
        setUploadedImageUrl(previewUrl);
      }
    },
  });

  useEffect(() => {
    console.log({ transaction, isEditing });
    if (transaction && isEditing) {
      // If editing, populate the form with the transaction data
      setFormData({
        id: transaction.id ?? 0,
        type: transaction.type || "",
        amount: transaction.amount ? String(transaction.amount) : "",
        fileUrl: transaction.fileUrl || "",
      });
      if (transaction.fileUrl) {
        setUploadedImageUrl(transaction.fileUrl);
      }
    } else if (transaction && !isEditing) {
      handleDeleteTransaction(transaction);
    }
  }, [transaction]);

  function resetForm() {
    setFormData({
      id: undefined,
      type: "",
      amount: "",
      fileUrl: "",
    });

    setFile(null);
    setUploadedImageUrl(null);
    setShouldRemoveFile(false);
  }

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
    try {
      const response = await deleteTransaction(transaction);

      if (response.transactions) {
        setFormData({
          type: "",
          amount: "",
          fileUrl: "",
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
        description: "Falha na operação de deletar.",
        variant: "destructive",
        duration: 4000,
      });
    }
  }

  // Submit logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const removedSpecialCharacters = formData.amount.replace(/\D/g, "");

    // Checa se os campos estão vazios
    if (!formData.type || !removedSpecialCharacters) {
      toast({
        title: "Campos obrigatórios!",
        description: "Preencha todos os campos.",
        variant: "warning",
        duration: 4000,
      });
      return;
    }

    const transactionData: Transaction = {
      type: formData.type as TransactionTypeEnum,
      amount: parseInt(removedSpecialCharacters),
      createdAt: transaction?.createdAt || new Date().toISOString(),
      fileUrl: "", // Backend will handle this
      id: isEditing && transaction?.id ? transaction.id : undefined,
    };

    try {
      if (isEditing) {
        await handleEditTransaction(transactionData, shouldRemoveFile, file);
      } else {
        await handleCreateTransaction(transactionData, file);
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

    // Function to create transaction
    async function handleCreateTransaction(
      transactionData: Transaction,
      file?: File
    ) {
      try {
        const response = await createTransaction(transactionData, file);

        if (response.transactions) {
          setFormData({
            type: "",
            amount: "",
            fileUrl: "",
          });
          setFile(null);
          setUploadedImageUrl(null);
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
          description: "Falha na criação de transferência.",
          variant: "destructive",
          duration: 4000,
        });
      }
    }

    // Function to edit transaction
    async function handleEditTransaction(
      transactionData: Transaction,
      shouldRemoveFile: boolean,
      file?: File
    ) {
      try {
        const response = await editTransaction(
          transactionData,
          shouldRemoveFile,
          file
        );

        if (response.transactions) {
          setFormData({
            type: "",
            amount: "",
            fileUrl: "",
          });
          setFile(null);
          setUploadedImageUrl(null);
          setShouldRemoveFile(false);
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
          description: "Falha na operação de editar.",
          variant: "destructive",
          duration: 4000,
        });
      }
    }
  };

  return (
    <Card className="bg-[#F5F5F5] relative pt-5 pb-0 pb-2">
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

            <div
              {...getRootProps()}
              className={cn(
                "relative border border-dashed rounded p-4 text-center transition-colors cursor-pointer",
                isDragActive
                  ? "border-secondary bg-gray-100"
                  : "border-gray-500 hover:bg-gray-200"
              )}
            >
              {!uploadedImageUrl ? (
                <div className="flex flex-col items-center">
                  <input {...getInputProps()} />
                  <CloudUpload size={30} />
                  <p className="text-black mt-2 text-sm">
                    {isDragActive ? (
                      "Solte a imagem aqui..."
                    ) : (
                      <>
                        <span className="font-semibold underline">Arraste</span>{" "}
                        ou{" "}
                        <span className="font-semibold underline">clique</span>{" "}
                        para selecionar arquivo
                      </>
                    )}
                  </p>
                  <p className="text-sm text-gray-400">
                    Formatos: JPG, PNG ou PDF até 1MB.
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <Image
                    src={uploadedImageUrl}
                    alt="Preview"
                    className="object-contain w-full h-10 rounded"
                    width={800}
                    height={800}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the dropzone
                      setUploadedImageUrl(null);
                      setFile(null);
                      setShouldRemoveFile(true); // Tells the backend if file is being delete when editing transaction
                    }}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow transition duration-200 hover:bg-black hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className={cn(
                buttonVariants({ size: "lg" }),

                "z-40 bg-black text-white w-[100%] cursor-pointer hover:text-white hover:bg-neutral-500 md:w-[70%] md:min-w-50"
              )}
            >
              {isEditing ? "Salvar alterações" : "Concluir transação"}
            </Button>
            {isEditing && (
              <Button
                type="button"
                className="-mt-4 bg-transparent border-none shadow-none text-red-600 p-0 w-auto h-auto self-start hover:underline"
                onClick={() => {
                  resetForm();
                  onCancelEditing?.(false);
                }}
              >
                <MoveLeft />
                Cancelar edição
              </Button>
            )}

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
