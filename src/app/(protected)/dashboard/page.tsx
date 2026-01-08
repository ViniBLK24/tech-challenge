"use client";

import SideMenu from "@/components/SideMenu";
import DashboardMenu from "@/components/DashboardMenu";
import TabletMenu from "@/components/TabletMenu";
import WelcomeCard from "@/components/WelcomeCard";
import TransactionActions from "@/components/TransactionAction";
import { useEffect, useState } from "react";
import { deleteTransaction, getTransactions } from "@/utils/api";
import getTotalBalance from "@/utils/getTotalBalance";
import BankStatement from "@/components/BankStatement";
import { Transaction } from "@/types/transactions";
import { useRouter } from "next/navigation";
import { NewTransaction } from "@/components/NewTransaction";
import { EditTransactionProvider } from "@/contexts/EditTransactionContext";
import { TransactionsProvider } from "@/contexts/TransactionsContext";
import { ERROR_CODES } from "@/constants/errors";
import { ErrorCodeEnum } from "@/types/apiErrors";

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
      setTotalBalance(getTotalBalance(data.transactions));
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

  async function refreshTransactions() {
    const data = await getTransactions();
    setTransactions(data.transactions);
    setTotalBalance(getTotalBalance(data.transactions));
  }

  return (
    <EditTransactionProvider>
      <div className="w-[100%]">
        <DashboardMenu onLogout={handleLogout} />
        <div className="lg: flex justify-center w-[100%]">
          <div className="flex flex-col gap-4 p-6 md:p-12 lg:grid grid-cols-7 w-[100%] max-w-[1600px]">
            <div className="hidden md:block">
              <TabletMenu />
              <SideMenu />
            </div>
            <div className="flex flex-col gap-4 col-span-4">
              <WelcomeCard userName={userName} />
              <NewTransaction />
              {/* <TransactionActions
              onComplete={handleDataFromChild}
              isEditing={isEditing}
              transaction={transaction}
              transactions={transactions}
              onCancelEditing={handleCancelEditing}
            /> */}
            </div>
            <div className="flex flex-col gap-4 col-span-2">
              <BankStatement />
            </div>
          </div>
        </div>
      </div>
    </EditTransactionProvider>
  );
}
