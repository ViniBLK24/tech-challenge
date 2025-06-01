import { Card } from "@/components/ui/Card";
import MoneyItem from "@/components/ui/MoneyItem";
import { Separator } from "@/components/ui/Separator";
import { Transaction, TransactionTypeEnum } from "@/types/transactions";
import { EllipsisVertical } from "lucide-react";
import ActionButton from "../ui/ActionButton";

interface TransactionsTableProps {
  transactions: Transaction[];
  formatDate: (date: string) => string;
}

export default function TransactionsTable({
  transactions,
  formatDate,
}: TransactionsTableProps) {
  return (
    <Card className="overflow-hidden">
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
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  {transaction.type === TransactionTypeEnum.TRANSFER
                    ? "Transferência"
                    : "Depósito"}
                </td>
                <td className="px-6 py-4">
                  <MoneyItem
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
            ))
          ) : (
            <tr>
              <td colSpan={3} className="px-6 py-4 text-center">
                Nenhuma transação encontrada
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  );
}
