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
import { sanitizeText } from "@/lib/sanitize";
import { logger } from "@/lib/logger";
import { handleError } from "@/lib/errorHandler";

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
          const errorMsg = handleError(data);
          logger.error("Error fetching account data:", errorMsg.description);
          setTransactions([]);
          setTotalBalance(0);
          return;
        }
        const rawUsername = data.result.account[0]["username"]?.split(" ")[0] || "";
        setUserName(sanitizeText(rawUsername));
      } catch (error) {
        const errorMsg = handleError(error);
        logger.error("Erro ao buscar dados da conta:", errorMsg.description);
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
    try {
      await fetch("/api/users/logout", { method: "POST" });
      setTimeout(() => {
        router.push("/");
      }, 100);
    } catch (error) {
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
