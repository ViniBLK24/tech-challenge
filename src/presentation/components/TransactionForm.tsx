"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Button, buttonVariants } from "./ui/Button";

import Image from "next/image";
import { TransactionTypeEnum } from "@/types/transactions";
import { X, CloudUpload, MoveLeft } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/shared/lib/utils";

export type TransactionFormData = {
  type: TransactionTypeEnum | undefined;
  amount: string;
  description: string;
  category: string;
};

type Props = {
  formData: TransactionFormData;
  uploadedImageUrl: string | null;
  isEditing?: boolean;

  onChange: (
    field: keyof TransactionFormData,
    value: TransactionFormData[keyof TransactionFormData]
  ) => void;
  onSubmit: () => void;
  onCancelEdit?: () => void;

  onFileDrop: (file: File) => void;
  onRemoveFile: () => void;
};

export function TransactionForm({
  formData,
  uploadedImageUrl,
  isEditing,
  onChange,
  onSubmit,
  onCancelEdit,
  onFileDrop,
  onRemoveFile,
}: Props) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [], "application/pdf": [] },
    onDrop: (files) => files[0] && onFileDrop(files[0]),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex flex-col gap-y-8 mt-3 md:mt-0"
    >
      <div className="flex flex-col gap-8 md:grid md:grid-cols-2 md:gap-8 md:items-end">
        <div className="flex flex-col gap-y-3">
          <Label>Tipo de transação *</Label>
          <Select
            key={formData.type}
            value={formData.type}
            onValueChange={(value) => onChange("type", value)}
          >
            <SelectTrigger>
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
        </div>

        <div className="flex flex-col gap-y-3">
          <Label>Valor *</Label>
          <Input
            maxLength={11}
            value={formData.amount}
            onChange={(e) => onChange("amount", e.target.value)}
            placeholder="00,00"
          />
        </div>

        <div className="flex flex-col gap-y-3 w-[100%]">
          <Label>Descrição</Label>
          <Input
            type="text"
            maxLength={30}
            placeholder="Ex: Uber, Salário..."
            value={formData.description}
            onChange={(e) => onChange("description", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-y-3 w-[100%]">
          <Label>Categoria</Label>
          <Input
            type="text"
            maxLength={20}
            placeholder="Ex: Lazer, Transporte..."
            value={formData.category}
            onChange={(e) => onChange("category", e.target.value)}
          />
        </div>
      </div>

      {/* Upload */}
      <div className="flex flex-col gap-y-8 md:w-[55%]">
        <div
          {...getRootProps()}
          className={cn(
            "border border-dashed rounded p-4 text-center cursor-pointer",
            isDragActive
              ? "border-secondary bg-gray-100"
              : "border-gray-500 hover:bg-gray-200"
          )}
        >
          <input {...getInputProps()} />

          {!uploadedImageUrl ? (
            <div className="flex flex-col items-center">
              <input {...getInputProps()} />
              <CloudUpload size={30} />
              <p className="text-black mt-2 text-sm">
                {isDragActive ? (
                  "Solte a imagem aqui..."
                ) : (
                  <>
                    <span className="font-semibold underline">Arraste</span> ou{" "}
                    <span className="font-semibold underline">clique</span> para
                    selecionar arquivo
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
                width={800}
                height={800}
                className="h-10 object-contain"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFile();
                }}
                className="absolute top-2 right-2 bg-white rounded-full p-1"
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
            "z-40 bg-black text-white w-[100%] cursor-pointer hover:text-white hover:bg-neutral-500 md:min-w-50"
          )}
        >
          {isEditing ? "Salvar alterações" : "Concluir transação"}
        </Button>

        {isEditing && (
          <Button
            type="button"
            onClick={onCancelEdit}
            className="bg-transparent text-red-600 shadow-none"
          >
            <MoveLeft />
            Cancelar edição
          </Button>
        )}
      </div>
    </form>
  );
}
