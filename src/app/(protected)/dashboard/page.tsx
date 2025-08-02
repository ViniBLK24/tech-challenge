"use client";

import SideMenu from "@/components/SideMenu";
import DashboardMenu from "@/components/DashboardMenu";
import TabletMenu from "@/components/TabletMenu";
import WelcomeCard from "@/components/WelcomeCard";
import TransactionActions from "@/components/TransactionAction";
import { useEffect, useState } from "react";
import { getTransactions } from "@/utils/api";
import getTotalBalance from "@/utils/getTotalBalance";
import BankStatement from "@/components/BankStatement";
import { Transaction } from "@/types/transactions";
import { useRouter } from "next/navigation";
import getCurrentUser from "@/utils/getCurrentUser";

export default function Dashboard() {
  const router = useRouter();
  const [totalBalance, setTotalBalance] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [transaction, setTransaction] = useState(null as Transaction | null);
  const [transactions, setTransactions] = useState([] as Transaction[]);
  // Fetch account data from backend
  useEffect(() => {
    async function fetchAccountData() {
      // Verificar se há usuário no localStorage antes de fazer chamadas
      const user = getCurrentUser();
      if (!user || user.trim() === "") {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("/api/account");
        const data = await response.json();

        if (!response.ok) {
          console.error("Error fetching account data:", data.error);
          // If authentication error, redirect to login
          if (data.error && data.error.includes("Token de autenticação")) {
            localStorage.removeItem("currentUser");
            router.push("/login");
            return;
          }
          // For other errors, try to continue with empty state
          setTransactions([]);
          setTotalBalance(0);
          return;
        }

        // Use backend transactions if available
        if (data.result && data.result.transactions && Array.isArray(data.result.transactions)) {
          setTransactions(data.result.transactions);
          setTotalBalance(getTotalBalance(data.result.transactions));
        } else {
          // If backend doesn't have transactions, set empty state
          // (Don't call local API since we're using backend authentication)
          console.log("No transactions found in backend account data");
          setTransactions([]);
          setTotalBalance(0);
        }
      } catch (error) {
        console.error("Erro ao buscar dados da conta:", error);
        // Only redirect on authentication errors
        if (error instanceof Error && error.message.includes("Token de autenticação")) {
          localStorage.removeItem("currentUser");
          router.push("/login");
          return;
        }
        // For other errors, continue with empty state
        setTransactions([]);
        setTotalBalance(0);
      }
    }
    fetchAccountData();
  }, [router]);

  // Logout function
  async function handleLogout() {
    console.log("handleLogout function called");
    try {
      await fetch("/api/users/logout", { method: "POST" });
      console.log("Logout API call successful");
      // Clear any local storage data
      localStorage.removeItem("currentUser");
      // Small delay to ensure cookie is cleared before redirect
      setTimeout(() => {
        router.push("/");
      }, 100);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Clear local storage even on error
      localStorage.removeItem("currentUser");
      setTimeout(() => {
        router.push("/");
      }, 100);
    }
  }

  // Remove editing states and returns component to "Nova Transação" action
  function handleCancelEditing(cancel: boolean) {
    setIsEditing(cancel);
    setTransaction(null);
  }

  // Will always update the totalBalance when a new transaction is made in <TransactionActions>
  async function handleDataFromChild(isEditingState: boolean) {
    const data = await getTransactions();
    setTotalBalance(getTotalBalance(data.transactions));
    setTransactions(data.transactions);
    setIsEditing(isEditingState);
  }

  function handleAction(transaction: Transaction, isEditing: boolean) {
    // This function is called when a transaction is selected for editing or deletion
    setIsEditing(isEditing);
    setTransaction(transaction);
  }

  return (
    <div className="w-[100%]">
      <DashboardMenu onLogout={handleLogout} />
      <div className="lg: flex justify-center w-[100%]">
        <div className="flex flex-col gap-4 p-6 md:p-12 lg:grid grid-cols-7 w-[100%] max-w-[1600px]">
          <div className="hidden md:block">
            <TabletMenu />
            <SideMenu />
          </div>
          <div className="flex flex-col gap-4 col-span-4">
            <WelcomeCard balance={totalBalance} />
            <TransactionActions
              onComplete={handleDataFromChild}
              isEditing={isEditing}
              transaction={transaction}
              transactions={transactions}
              onCancelEditing={handleCancelEditing}
            />
          </div>
          <div className="flex flex-col gap-4 col-span-2">
            <BankStatement
              handleAction={handleAction}
              transactions={transactions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
