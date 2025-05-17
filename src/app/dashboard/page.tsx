"use client";

import SideMenu from "@/components/SideMenu";
import DashboardMenu from "@/components/DashboardMenu";
import TabletMenu from "@/components/TabletMenu";
import WelcomeCard from "@/components/WelcomeCard";
import TransactionActions from "@/components/TransactionAction";
import { useEffect, useState } from "react";
import { getTransactions } from "@/utils/api";

export default function Dashboard() {
  const [totalBalance, setTotalBalance] = useState(0);

  function getTotalBalance(data: []) {
    const total = data.reduce(
      (value, item) =>
        item.type === "deposit" ? value + item.amount : value - item.amount,
      0
    );
    return total;
  }

  // Always get the total of each type and show the sum on page refresh
  useEffect(() => {
    async function getTotalAmountOnLoad() {
      const data = await getTransactions();
      setTotalBalance(getTotalBalance(data.transactions));
    }

    getTotalAmountOnLoad();
  }, []);

  // Will always update the totalBalance when a new transaction is made in <TransactionActions>
  function handleDataFromChild(data: []) {
    setTotalBalance(getTotalBalance(data));
    console.log(totalBalance);
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
            <TransactionActions onSubmit={handleDataFromChild} />
          </div>
          <div className="h-[100%] bg-secondary col-span-2">Transações</div>
        </div>
      </div>
    </div>
  );
}
