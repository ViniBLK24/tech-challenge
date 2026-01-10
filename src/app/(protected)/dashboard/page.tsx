"use client";

import SideMenu from "@/presentation/components/SideMenu";
import DashboardMenu from "@/presentation/components/DashboardMenu";
import TabletMenu from "@/presentation/components/TabletMenu";
import WelcomeCard from "@/presentation/components/WelcomeCard";
import TransactionActions from "@/presentation/components/TransactionAction";
import { useEffect, useState } from "react";
import {
  deleteTransaction,
  getTransactions,
} from "@/presentation/api/transactions.api";
import { CalculateBalanceUseCase } from "@/domain/use-cases/transactions";
import BankStatement from "@/presentation/components/BankStatement";
import { Transaction } from "@/domain/entities";
import { useRouter } from "next/navigation";
import { sanitizeText } from "@/shared/lib/sanitize";
import { logger } from "@/shared/lib/logger";
import { handleError } from "@/shared/lib/errorHandler";
import { NewTransaction } from "@/presentation/components/NewTransaction";
import { EditTransactionProvider } from "@/contexts/EditTransactionContext";
import { TransactionsProvider } from "@/contexts/TransactionsContext";
import { ERROR_CODES } from "@/shared/constants/errors";
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
          const errorMsg = handleError(data);
          logger.error("Error fetching account data:", errorMsg.description);
          setTransactions([]);
          setTotalBalance(0);
          return;
        }
        const rawUsername =
          data.result.account[0]["username"]?.split(" ")[0] || "";
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
      const calculateBalance = new CalculateBalanceUseCase();
      setTotalBalance(calculateBalance.execute(data.transactions));
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

  // async function refreshTransactions() {
  //   const data = await getTransactions();
  //   setTransactions(data.transactions);
  //   setTotalBalance(getTotalBalance(data.transactions));
  // }

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
