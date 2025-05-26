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
import { Card } from "@/components/ui/Card";

export default function Dashboard() {
  const [totalBalance, setTotalBalance] = useState(0);

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
  }

  return (
    <div className="w-[100%]">
      <DashboardMenu />
      <div className="flex justify-center w-[100%]">
        <div className="flex flex-col gap-4 p-6 md:p-12 lg:grid lg:grid-cols-[1fr_5fr_2fr] lg:w-[100%] lg:max-w-[1600px]">
          <div className="hidden md:block">
            <TabletMenu />
            <SideMenu />
          </div>
          <div className="flex flex-col gap-4">
            <WelcomeCard balance={totalBalance} />
            <TransactionActions onSubmit={handleDataFromChild} />
          </div>
          <Card className="p-6">
            <BankStatement />
          </Card>
        </div>
      </div>
    </div>
  );
}
