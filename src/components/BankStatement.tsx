import { Separator } from "./ui/Separator";
import { Card, CardContent, CardTitle } from "./ui/Card";
import { useEffect, useState } from "react";
import { Transaction, TransactionTypeEnum } from "@/types/transactions";
import MoneyItem from "./ui/MoneyItem";
import ActionButton from "./ui/ActionButton";
import Link from "next/link";
import { Loader2Icon } from "lucide-react";

export default function BankStatement(props: {
  handleAction?: (transaction: Transaction, isEditing: boolean) => void;
  transactions: Transaction[];
}) {
  const [transactionsData, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!props.transactions) return;

    setIsLoading(true);

    setTransactions(props.transactions.slice(0, 8));
    setIsLoading(false);
  }, [props.transactions]);

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "2-digit",
      day: "2-digit",
    };
    const formattedDate = new Date(date).toLocaleDateString("pt-BR", options);
    return formattedDate;
  };

  return (
    <Card className=" h-[100%]">
      <CardContent className="p-2 py-8 flex flex-col">
        <CardTitle className="text-2xl text-[25px] mb-8">Extrato</CardTitle>
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <p className="text-muted-foreground p-4">
              <Loader2Icon className="animate-spin" />
            </p>
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        )}
        {transactionsData?.map((transaction) => (
          <div className="flex row justify-between " key={transaction.id}>
            <div className="flex flex-col flex-1">
              <div className="pb-2">
                <p className="text-md">
                  {transaction.type === TransactionTypeEnum.TRANSFER
                    ? "Transferência"
                    : "Depósito"}
                </p>

                <MoneyItem
                  value={transaction.amount.toString()}
                  type={transaction.type}
                />
              </div>
              <Separator orientation="horizontal" />
            </div>
            <div className="flex flex-col items-end">
              <p className="text-muted-foreground text-xs">
                {formatDate(transaction.createdAt)}
              </p>
              <div className="flex column ">
                <ActionButton
                  onEdit={() => props.handleAction?.(transaction, true)}
                  onDelete={() => props.handleAction?.(transaction, false)}
                />
              </div>
            </div>
          </div>
        ))}
        {!isLoading && transactionsData.length > 0 && (
          <div className="mt-8 text-center underline-offset-4  font-bold hover:underline bold">
            <Link href="/transactions"> Ver extrato completo</Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
