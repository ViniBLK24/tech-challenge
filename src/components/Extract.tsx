import { useState } from "react";
import { Transaction, TransactionTypeEnum } from "@/types/transactions";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { Button } from "./ui/Button";
import { Pencil, Trash } from "lucide-react";

type Props = {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
};

export default function Extract({ transactions, onEdit, onDelete }: Props) {
  const [dateFilter, setDateFilter] = useState("");

  // Filtra as transações pela data (YYYY-MM-DD)
  const filteredTransactions = dateFilter
    ? transactions.filter((t) =>
        t.createdAt.startsWith(dateFilter)
      )
    : transactions;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Extrato</h2>
      <div className="mb-4">
        <label className="font-medium">
          Filtrar por data:{" "}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </label>
      </div>
      {filteredTransactions.length === 0 && (
        <div>Nenhuma transação encontrada.</div>
      )}
      {filteredTransactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between border-b py-2"
        >
          <div>
            <div className="font-semibold">
              {transaction.type === TransactionTypeEnum.DEPOSIT
                ? "Depósito"
                : "Transferência"}
              {transaction.name ? ` - ${transaction.name}` : ""}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(transaction.createdAt).toLocaleDateString("pt-BR")}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={
                transaction.type === TransactionTypeEnum.DEPOSIT
                  ? "text-green-700 font-bold"
                  : "text-red-700 font-bold"
              }
            >
              {transaction.type === TransactionTypeEnum.DEPOSIT ? "" : "-"}
              {currencyFormatter(transaction.amount.toString())}
            </span>
            <Button
              size="icon"
              variant="secondary"
              onClick={() => onEdit(transaction)}
            >
              <Pencil size={16} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={() => onDelete(transaction)}
            >
              <Trash size={16} />
            </Button>
          </div>
        </div>
      ))}
      <div className="text-center font-semibold mt-6">
        Ver extrato completo
      </div>
    </div>
  );
}