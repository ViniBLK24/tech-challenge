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
import getCurrentUserId from "@/utils/getCurrentUserId";
import { useRouter } from "next/navigation";
import { getUsers } from "@/utils/usersApi";

export default function Dashboard() {
  const router = useRouter();
  const [totalBalance, setTotalBalance] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [transaction, setTransaction] = useState(null as Transaction | null);
  const [transactions, setTransactions] = useState([] as Transaction[]);
  const [isCurrentUserRegistered, setIsCurrentUserRegistered] = useState(false);

  // Checks if the user on localStorage matches registered users on db
  useEffect(() => {
    async function checkUserInDb() {
      try {
        const currentUserId = getCurrentUserId();
        const data = await getUsers();
        const allUsers = data.users;

        const found = allUsers.some((user: any) => user.id === currentUserId);

        if (!found) {
          // Redirect if user ID is not found
          router.push("/");
        }

        setIsCurrentUserRegistered(true);
      } catch (error) {
        console.error("Erro ao verificar usuário:", error);
      }
    }
    checkUserInDb();
  }, []);

  // Check total amount in account
  useEffect(() => {
    async function getTotalAmountOnLoad() {
      const data = await getTransactions();
      setTransactions(data.transactions);
      setTotalBalance(getTotalBalance(data.transactions));
    }
    getTotalAmountOnLoad();
  }, [isCurrentUserRegistered]);

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
      <DashboardMenu />
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
