"use client";

import SideMenu from "@/presentation/components/SideMenu";
import DashboardMenu from "@/presentation/components/DashboardMenu";
import TabletMenu from "@/presentation/components/TabletMenu";
import WelcomeCard from "@/presentation/components/WelcomeCard";
import TransactionActions from "@/presentation/components/TransactionAction";
import { useEffect, useState } from "react";
import { getTransactions } from "@/presentation/api/transactions.api";
import { CalculateBalanceUseCase } from "@/domain/use-cases/transactions";
import BankStatement from "@/presentation/components/BankStatement";
import { Transaction } from "@/domain/entities";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [totalBalance, setTotalBalance] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [transaction, setTransaction] = useState(null as Transaction | null);
  const [transactions, setTransactions] = useState([] as Transaction[]);
  const [userName, setUserName] = useState("");
  // Fetch account data from backend
  useEffect(() => {
    async function fetchAccountData() {
      try {
        const response = await fetch("/api/account");
        const data = await response.json();

        if (!response.ok) {
          console.error("Error fetching account data:", data.error);
          // For errors, continue with empty state
          setTransactions([]);
          setTotalBalance(0);
          return;
        }
        setUserName(data.result.account[0]["username"].split(" ")[0]); // Only gets user's first name
      } catch (error) {
        console.error("Erro ao buscar dados da conta:", error);
        // For errors, continue with empty state
        setTransactions([]);
        setTotalBalance(0);
      }
    }
    fetchAccountData();

    // Get total amount and transactions list
    async function getTotalAmountOnLoad() {
      const data = await getTransactions();
      setTransactions(data.transactions);
      const calculateBalance = new CalculateBalanceUseCase();
      setTotalBalance(calculateBalance.execute(data.transactions));
    }
    getTotalAmountOnLoad();
  }, []);

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
    const calculateBalance = new CalculateBalanceUseCase();
    setTotalBalance(calculateBalance.execute(data.transactions));
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
            <WelcomeCard balance={totalBalance} userName={userName} />
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
