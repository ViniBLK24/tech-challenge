import { Separator } from "./ui/Separator";
import { Card, CardContent, CardTitle } from "./ui/Card";
import { useEffect, useState } from "react";
import { Transaction, TransactionTypeEnum } from "@/types/transactions";
import MoneyItem from "./ui/MoneyItem";
import ActionButton from "./ui/ActionButton";
import Link from "next/link";
import { Loader2Icon } from "lucide-react";
// Adicione o import do gráfico
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function BankStatement(props: {
  handleAction?: (transaction: Transaction, isEditing: boolean) => void;
  transactions: Transaction[];
}) {
  const [transactionsData, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("");

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

  // Filtro por data (YYYY-MM-DD)
  const filteredTransactions = dateFilter
    ? transactionsData.filter((t) => t.createdAt.startsWith(dateFilter))
    : transactionsData;

  // Cálculo dos totais de entrada e saída
  const totalEntrada = filteredTransactions
    .filter((t) => t.type === TransactionTypeEnum.DEPOSIT)
    .reduce((acc, t) => acc + t.amount, 0);

  const totalSaida = filteredTransactions
    .filter((t) => t.type === TransactionTypeEnum.TRANSFER)
    .reduce((acc, t) => acc + t.amount, 0);

  // Dados para o gráfico
  const chartData = {
    labels: ["Entradas", "Saídas"],
    datasets: [
      {
        label: "Valores",
        data: [totalEntrada, totalSaida],
        backgroundColor: ["#22c55e", "#ef4444"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0, 
        max: 10000000, 
        ticks: {
          callback: function (tickValue: string | number) {
            const num = typeof tickValue === "number" ? tickValue : Number(tickValue);
            return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
          },
        },
      },
    },
  };

  return (
    <Card className=" h-[100%]">
      <CardContent className="p-2 py-8 flex flex-col">
        <CardTitle className="text-2xl text-[25px] mb-8">Extrato</CardTitle>
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
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <p className="text-muted-foreground p-4">
              <Loader2Icon className="animate-spin" />
            </p>
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        )}
        {filteredTransactions?.map((transaction) => (
          <div className="flex row justify-between " key={transaction.id}>
            <div className="flex flex-col flex-1">
              <div className="pb-2">
                <p className="text-md">
                  {transaction.type === TransactionTypeEnum.TRANSFER
                    ? "Transferência"
                    : "Depósito"}
                  {transaction.name ? ` - ${transaction.name}` : ""}
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
        {!isLoading && filteredTransactions.length > 0 && (
          <div className="mt-8 text-center underline-offset-4  font-bold hover:underline bold">
            <Link href="/transactions"> Ver extrato completo</Link>
          </div>
        )}
        {!isLoading && filteredTransactions.length === 0 && (
          <div className="text-center text-muted-foreground mt-8">
            Nenhuma transação encontrada para a data selecionada.
          </div>
        )}

        {/* Gráfico e totais */}
        <div className="mt-10 flex flex-col items-center">
          <div className="w-full max-w-xs">
            <Bar data={chartData} options={chartOptions} />
          </div>
          <div className="flex justify-between w-full max-w-xs mt-4">
            <div className="text-green-700 font-semibold">
              Entradas:{" "}
              {totalEntrada.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <div className="text-red-700 font-semibold">
              Saídas:{" "}
              {totalSaida.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
