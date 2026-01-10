import { Card } from "../ui/Card";
import MoneyItem from "../ui/MoneyItem";
import { Separator } from "../ui/Separator";
import { Transaction, TransactionTypeEnum } from "@/domain/entities";
import { Eye, EyeClosed, Loader2Icon } from "lucide-react";
import ActionButton from "../ui/ActionButton";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Modal from "../ui/Modal";
import Image from "next/image";
import { sanitizeText, sanitizeUrl } from "@/shared/lib/sanitize";

interface TransactionsTableProps {
  transactions: Transaction[];
  formatDate: (date: string) => string;
}
import { useEditTransaction } from "@/contexts/EditTransactionContext";
import { useTransactions } from "@/contexts/TransactionsContext";

export default function TransactionsTable({
  transactions,
  formatDate,
}: TransactionsTableProps) {
  const { deleteTransaction } = useTransactions();
  const { openEdit } = useEditTransaction();
  const [isLoading, setIsLoading] = useState(true);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState("");

  useEffect(() => {
    setIsLoading(true);
    if (transactions.length === 0) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [transactions]);

  return (
    <Card className="overflow-auto">
      <div className="flex items-center justify-center  text-lg w-full">
        <button
          onClick={() => setIsBalanceHidden(!isBalanceHidden)}
          className="p-4"
          aria-label="Alternar visibilidade do saldo"
          title="Alternar visibilidade do saldo"
        >
          {isBalanceHidden ? (
            <EyeClosed className="text-primary" size={30} />
          ) : (
            <Eye className="text-primary" size={30} />
          )}
        </button>
      </div>

      <table className="w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left">Tipo</th>
            <th className="px-6 py-3 text-left">Valor</th>
            <th className="px-6 py-3 text-left">Descrição</th>
            <th className="px-6 py-3 text-left">Categoria</th>
            <th className="px-6 py-3 text-left">Data</th>
            <th className="px-6 py-3 text-left">Ações</th>
          </tr>
          <tr>
            <th className="text-left" colSpan={6}>
              <Separator className="my-0 w-full" />
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={4} className="px-6 py-4">
                <div className="flex flex-col items-center">
                  <p className="text-muted-foreground p-4">
                    <Loader2Icon className="animate-spin" />
                  </p>
                  <p className="text-muted-foreground">Carregando...</p>
                </div>
              </td>
            </tr>
          )}

          {!isLoading &&
            transactions.length > 0 &&
            transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  {transaction.type === TransactionTypeEnum.TRANSFER
                    ? "Transferência"
                    : "Depósito"}
                </td>
                <td className="px-6 py-4">
                  <MoneyItem
                    isHidden={isBalanceHidden}
                    value={transaction.amount.toString()}
                    type={transaction.type}
                  />
                </td>
                <td className="px-6 py-4 ">
                  {sanitizeText(transaction.description)}
                </td>
                <td className="px-6 py-4 ">
                  {sanitizeText(transaction.category)}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {formatDate(transaction.createdAt)}
                </td>
                <td className="px-6 py-4 text-muted-foreground flex align-end">
                  <ActionButton
                    onViewFile={
                      transaction.fileUrl && sanitizeUrl(transaction.fileUrl)
                        ? () => {
                            const safeUrl = sanitizeUrl(transaction.fileUrl);
                            if (safeUrl) {
                              setReceiptUrl(safeUrl);
                              setIsReceiptModalOpen(true);
                            }
                          }
                        : undefined
                    }
                    onEdit={() => openEdit(transaction)}
                    onDelete={async () => {
                      await deleteTransaction(transaction);
                    }}
                  />
                </td>
              </tr>
            ))}

          {!isLoading && transactions.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center">
                Nenhuma transação encontrada
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {typeof window != "undefined" &&
        isReceiptModalOpen &&
        sanitizeUrl(receiptUrl) &&
        createPortal(
          <Modal onClose={() => setIsReceiptModalOpen(false)}>
            <Image
              src={sanitizeUrl(receiptUrl) || ""}
              alt="Comprovante da transação"
              width={800}
              height={800}
              className="object-contain w-full h-full max-w-[80vw] max-h-[80vh]"
            />
          </Modal>,
          document.body
        )}
    </Card>
  );
}
