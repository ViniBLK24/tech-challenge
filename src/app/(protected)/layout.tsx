"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import getCurrentUser from "@/utils/getCurrentUser";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const user = getCurrentUser();
      
      // Se não há usuário no localStorage, redirecionar imediatamente
      if (!user || user.trim() === "") {
        router.push("/login");
        return;
      }

      // Só verificar com a API se há usuário no localStorage
      try {
        const response = await fetch("/api/account");
        if (!response.ok) {
          // Se a resposta não for ok, limpar localStorage e redirecionar
          localStorage.removeItem("currentUser");
          router.push("/login");
          return;
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        // Em caso de erro, limpar localStorage e redirecionar
        localStorage.removeItem("currentUser");
        router.push("/login");
        return;
      }
    };

    checkAuth();
  }, [router]);

  return <>{children}</>;
} 