"use client";

import SideMenu from "@/components/SideMenu";
import DashboardMenu from "@/components/DashboardMenu";
import TabletMenu from "@/components/TabletMenu";
import InvestmentsWrapper from "@/components/InvestmentsWrapper";
import { useRouter } from "next/navigation";
import getCurrentUser from "@/utils/getCurrentUser";
import { useEffect } from "react";

export default function Investments() {
  const router = useRouter();

  useEffect(() => {
    // Verificar se há usuário no localStorage antes de renderizar
    const user = getCurrentUser();
    if (!user || user.trim() === "") {
      router.push("/login");
      return;
    }
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

  return (
    <div className="w-[100%]">
      <DashboardMenu onLogout={handleLogout} />
      <div className="lg: flex justify-center w-[100%]">
        <div className="flex flex-col gap-4 p-6 md:p-12 lg:grid grid-cols-7 w-[100%] max-w-[1600px]">
          <div className="hidden md:block">
            <TabletMenu />
            <SideMenu />
          </div>
          <div className="flex flex-col gap-4 col-span-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Investimentos</h1>
              <InvestmentsWrapper />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 