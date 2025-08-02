import { getTransactions } from "@/utils/api";
import { Separator } from "./ui/Separator";
import { CardTitle } from "./ui/Card";
import { useEffect, useState } from "react";
import { Transaction, TransactionTypeEnum } from "@/types/transactions";
import MoneyItem from "./ui/MoneyItem";
import { EllipsisVertical } from "lucide-react";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Button } from "./ui/Button";

// Chart.js imports
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BankStatement() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    getTransactions().then((res) => {
      setTransactions(res.transactions.slice(0, 8));
      setAllTransactions(res.transactions);
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

  // Filtro por data
  function handleFilter() {
    if (!startDate || !endDate) return;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const filtered = allTransactions.filter((t) => {
      const date = new Date(t.createdAt);
      return date >= start && date <= end;
    });
    setTransactions(filtered.slice(0, 8));
  }

  // Dados do gráfico
  const entrada = transactions.filter(t => t.type === TransactionTypeEnum.DEPOSIT).reduce((acc, t) => acc + t.amount, 0);
  const saida = transactions.filter(t => t.type === TransactionTypeEnum.TRANSFER).reduce((acc, t) => acc + t.amount, 0);

  const chartData = {
    labels: ["Entradas", "Saídas"],
    datasets: [
      {
        label: "Valores",
        data: [entrada, saida],
        backgroundColor: ["#22c55e", "#ef4444"],
      },
    ],
  };

  return (
    <div>
      <CardTitle className="text-2xl text-[25px] mb-8">Extrato</CardTitle>

      {/* Filtro por data */}
      <div className="flex flex-col gap-2 items-start mb-6">
        <Label htmlFor="start-date">De:</Label>
        <Input
          id="start-date"
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="w-[150px]"
        />
        <Label htmlFor="end-date">Até:</Label>
        <Input
          id="end-date"
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="w-[150px]"
        />
        <Button type="button" onClick={handleFilter} className="mt-2">Filtrar</Button>
      </div>

      {/* Lista de transações */}
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex row justify-between ">
          <div className="flex flex-col flex-1">
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
      ))}
      <div className="mt-4 text-right">
        <a href="/transactions" className="text-blue-500 hover:underline">Ver extrato completo</a>
      </div>

      {/* Gráfico de entradas e saídas */}
      <div className="mb-8 mt-8">
        <Bar data={chartData} />
      </div>
    </div>
  );
}
