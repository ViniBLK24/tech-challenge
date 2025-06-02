import { Card } from "@/components/ui/Card";
import MoneyItem from "@/components/ui/MoneyItem";
import { Separator } from "@/components/ui/Separator";
import { Transaction, TransactionTypeEnum } from "@/types/transactions";
import { Eye, EyeClosed, Loader2Icon } from "lucide-react";
import ActionButton from "../ui/ActionButton";
import { useEffect, useState } from "react";
import { Button } from "../ui/Button";

interface TransactionsTableProps {
  transactions: Transaction[];
  formatDate: (date: string) => string;
}

export default function TransactionsTable({
  transactions,
  formatDate,
}: TransactionsTableProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    if (transactions.length === 0) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [transactions]);

  return (
    <Card className="overflow-hidden">
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
            <th className="px-6 py-3 text-left">Data</th>
            <th className="px-6 py-3 text-left">Ações</th>
          </tr>
          <tr>
            <th className="text-left" colSpan={4}>
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
                <td className="px-6 py-4 text-muted-foreground">
                  {formatDate(transaction.createdAt)}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  <ActionButton />
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
    </Card>
  );
}
