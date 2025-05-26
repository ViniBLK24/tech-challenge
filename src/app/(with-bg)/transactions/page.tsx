"use client";

import { useEffect, useState } from "react";
import { getTransactions } from "@/utils/api";
import { Transaction, TransactionTypeEnum } from "@/types/transactions";
import DashboardMenu from "@/components/DashboardMenu";
import PageHeader from "@/components/transactions/PageHeader";
import SearchFilter from "@/components/transactions/SearchFilter";
import TransactionsTable from "@/components/transactions/TransactionsTable";
import Pagination from "@/components/transactions/Pagination";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const itemsPerPage = 10;

  useEffect(() => {
    getTransactions().then((res) => {
      setTransactions(res.transactions);
      setFilteredTransactions(res.transactions);
    });
  }, []);

  useEffect(() => {
    let result = transactions;

    // Apply type filter
    if (typeFilter !== "all") {
      result = result.filter(
        (transaction) => transaction.type === typeFilter
      );
    }

    // Apply search filter (search by amount)
    if (searchTerm) {
      result = result.filter((transaction) =>
        transaction.amount.toString().includes(searchTerm)
      );
    }

    setFilteredTransactions(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, typeFilter, transactions]);

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    const formattedDate = new Date(date).toLocaleDateString("pt-BR", options);
    return formattedDate;
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="w-[100%]">
      <DashboardMenu />
      <div className="flex justify-center w-[100%]">
        <div className="flex flex-col gap-4 p-6 md:p-12 w-[100%] max-w-[1200px]">
          <PageHeader 
            title="Extrato Completo" 
            backHref="/dashboard" 
            backLabel="Voltar" 
          />

          <SearchFilter 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
          />

          <TransactionsTable 
            transactions={paginatedTransactions} 
            formatDate={formatDate} 
          />

          {totalPages > 0 && (
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              setCurrentPage={setCurrentPage} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
