"use client";

import { useEffect, useState } from "react";
import { deleteTransaction, getTransactions } from "@/utils/api";
import { Transaction } from "@/types/transactions";
import DashboardMenu from "@/components/DashboardMenu";
import PageHeader from "@/components/transactions/PageHeader";
import SearchFilter from "@/components/transactions/SearchFilter";
import TransactionsTable from "@/components/transactions/TransactionsTable";
import Pagination from "@/components/transactions/Pagination";
import SideMenu from "@/components/SideMenu";
import TabletMenu from "@/components/TabletMenu";
import TransactionActions from "@/components/TransactionAction";
import Modal from "@/components/ui/Modal";
import { createPortal } from "react-dom";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 10;

  async function handleDataFromChild(isEditing: boolean) {
    const data = await getTransactions();
    setTransactions(data.transactions);
    setFilteredTransactions(data.transactions);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 300);
  }

  async function handleDeleteTransaction(transaction: Transaction) {
    try {
      await deleteTransaction(transaction);
      const updatedTransactions = transactions.filter(
        (t) => t.id !== transaction.id
      );
      setTransactions(updatedTransactions);
      setFilteredTransactions(updatedTransactions);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  }

  const handleTransactionSelect = (
    transaction: Transaction | null,
    isEditing: boolean
  ) => {
    if (!isEditing) {
      handleDeleteTransaction(transaction!);
      return;
    }
    setTransaction(transaction);
    setIsModalOpen(true); // Abre a modal
  };

  useEffect(() => {
    getTransactions().then((res) => {
      setTransactions(res.transactions);
      setFilteredTransactions(res.transactions);
    });
  }, []);

  function handleCancelEditing(cancel: boolean) {
    setIsModalOpen(cancel);
  }

  useEffect(() => {
    let result = transactions;

    // Apply type filter
    if (typeFilter !== "all") {
      result = result.filter((transaction) => transaction.type === typeFilter);
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
      <div className=" flex justify-center w-[100%]">
        <div className="flex flex-col gap-4 p-6 md:p-12 lg:grid grid-cols-7 w-[100%] max-w-[1600px]">
          <div className="hidden md:block">
            <TabletMenu />
            <SideMenu />
          </div>
          <div className="flex flex-col col-span-6">
            <div className="flex flex-col w-[100%] max-w-[1200px]">
              <PageHeader
                title="Extrato"
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
                onTransactionSelect={handleTransactionSelect}
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
      </div>
      <div className="flex flex-col min-h-screen">
        {isModalOpen &&
          createPortal(
            <Modal onClose={() => setIsModalOpen(false)}>
              <div className="lg:w-[60%]">
                <TransactionActions
                  onComplete={handleDataFromChild}
                  isEditing={true}
                  transaction={transaction}
                  transactions={transactions}
                  onCancelEditing={handleCancelEditing}
                ></TransactionActions>
              </div>
            </Modal>,
            document.body
          )}
      </div>
    </div>
  );
}
