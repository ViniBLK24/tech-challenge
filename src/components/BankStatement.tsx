import { Separator } from "./ui/Separator";
import { Card, CardContent, CardTitle } from "./ui/Card";
import { useEffect, useState } from "react";
import { Transaction, TransactionTypeEnum } from "@/types/transactions";
import MoneyItem from "./ui/MoneyItem";
import ActionButton from "./ui/ActionButton";
import Link from "next/link";
import { Loader2Icon } from "lucide-react";
import { createPortal } from "react-dom";
import Modal from "./ui/Modal";
import Image from "next/image";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function BankStatement(props: {
  handleAction?: (transaction: Transaction, isEditing: boolean) => void;
  transactions: Transaction[];
}) {
  const [transactionsData, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!props.transactions) return;
    setIsLoading(true);
    setTransactions(props.transactions.slice(0, 8));
    setIsLoading(false);
  }, [props.transactions]);

  useEffect(() => {
    // Filtra por data
    let result = transactionsData;
    if (dateFrom) {
      const from = new Date(dateFrom);
      result = result.filter((t) => new Date(t.createdAt) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      result = result.filter((t) => new Date(t.createdAt) <= to);
    }
    setFilteredTransactions(result);
  }, [dateFrom, dateTo, transactionsData]);

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "2-digit",
      day: "2-digit",
    };
    const formattedDate = new Date(date).toLocaleDateString("pt-BR", options);
    return formattedDate;
  };

  // Dados para o gráfico
  const entradas = filteredTransactions
    .filter((t) => t.type === TransactionTypeEnum.DEPOSIT)
    .reduce((acc, t) => acc + Math.round(t.amount), 0);
  const saidas = filteredTransactions
    .filter((t) => t.type === TransactionTypeEnum.TRANSFER)
    .reduce((acc, t) => acc + Math.round(t.amount), 0);

  const chartData = {
    labels: ["Entradas", "Saídas"],
    datasets: [
      {
        label: "R$",
        data: [entradas, saidas],
        backgroundColor: ["#22c55e", "#ef4444"],
        borderColor: ["#166534", "#991b1b"],
        borderWidth: 2,
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
        max: 50000,
        stepSize: 1000,
        ticks: {
          color: "#111",
          stepSize: 1000,
          callback: function(value: number) {
            return Number.isInteger(value) ? value : null;
          },
        },
        grid: { color: "#e5e7eb" },
      },
      x: {
        ticks: { color: "#111" },
        grid: { color: "#e5e7eb" },
      },
    },
  };

  function handleFilter(e: React.FormEvent) {
    e.preventDefault();
    // O filtro já é aplicado pelo useEffect
  }

  return (
    <>
      <Card className="h-[100%] px-4">
        <CardContent className="p-2 py-10 flex flex-col">
          <CardTitle className="text-2xl text-[25px] mb-8">Extrato</CardTitle>

          {/* Filtro por data */}
          <form className="flex gap-4 items-end mb-6 flex-wrap" onSubmit={handleFilter} aria-label="Filtro por data">
            <div>
              <label htmlFor="dateFrom" className="block text-sm font-semibold text-black mb-1">
                De:
              </label>
              <input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="border rounded px-2 py-1 text-black"
                aria-label="Data inicial"
              />
            </div>
            <div>
              <label htmlFor="dateTo" className="block text-sm font-semibold text-black mb-1">
                Até:
              </label>
              <input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="border rounded px-2 py-1 text-black"
                aria-label="Data final"
              />
            </div>
            <button
              type="submit"
              className="bg-pattern-green text-white px-4 py-2 rounded font-bold hover:bg-green-700 focus:outline focus:outline-2 focus:outline-pattern-green"
              aria-label="Filtrar"
            >
              Filtrar
            </button>
          </form>

          {/* Gráfico de Entradas e Saídas */}
          <section
            aria-label="Gráfico de entradas e saídas"
            className="mb-8 bg-white rounded-lg p-4 shadow focus:outline-none"
            tabIndex={0}
          >
            <h2 className="text-lg font-bold text-black mb-2" tabIndex={0}>
              Entradas vs Saídas
            </h2>
            <Bar data={chartData} options={chartOptions} aria-label="Gráfico de barras de entradas e saídas" />
          </section>

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
                    onViewFile={
                      transaction.fileUrl
                        ? () => {
                            setReceiptUrl(transaction.fileUrl);
                            setIsReceiptModalOpen(true);
                          }
                        : undefined
                    }
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
        </CardContent>
      </Card>
      {typeof window != "undefined" &&
        isReceiptModalOpen &&
        createPortal(
          <Modal onClose={() => setIsReceiptModalOpen(false)}>
            <Image
              src={receiptUrl}
              alt="Comprovante da transação"
              width={800}
              height={800}
              className="object-contain w-full h-full max-w-[80vw] max-h-[80vh]"
            />
          </Modal>,
          document.body
        )}
    </>
  );
}
