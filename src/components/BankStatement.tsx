import { getTransactions } from "@/utils/api";
import { Separator } from "./ui/Separator";
import { CardTitle } from "./ui/Card";
import { useEffect, useState } from "react";
import { Transaction, TransactionTypeEnum } from "@/types/transactions";
import MoneyItem from "./ui/MoneyItem";
import { EllipsisVertical } from "lucide-react";

export default function BankStatement() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    getTransactions().then((res) => {
      setTransactions(res.transactions.slice(0, 8));
    });
  }, []);

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "2-digit",
      day: "2-digit",
    };
    const formattedDate = new Date(date).toLocaleDateString("pt-BR", options);
    return formattedDate;
  };

  return (
    <div>
      <CardTitle className="text-2xl text-[25px] mb-8">Extrato</CardTitle>

      {transactions.map((transaction) => (
        <>
          <div className="flex row justify-between ">
            <div key={transaction.id} className="flex flex-col flex-1">
              <div className="pb-2">
                <p className="text-md">
                  {transaction.type === TransactionTypeEnum.TRANSFER
                    ? "Transferência"
                    : "Depósito"}
                </p>

                <MoneyItem value={transaction.amount} type={transaction.type} />
                <Separator orientation="horizontal" />
              </div>
            </div>
            <div className="flex column flex-none">
              <p className="text-muted-foreground text-xs">
                {formatDate(transaction.createdAt)}
              </p>
            </div>
            <div className="flex flex-col flex-none align-left">
              <EllipsisVertical />
            </div>
          </div>
        </>
      ))}
      <div className="mt-4 text-right">
        <a href="/transactions" className="text-blue-500 hover:underline">Ver extrato completo</a>
      </div>
    </div>
  );
}
