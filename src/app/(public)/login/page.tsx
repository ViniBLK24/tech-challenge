"use client";

import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/login/LoginForm";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import getCurrentUser from "@/utils/getCurrentUser";

export default function LoginPage() {
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Se o usuário já estiver logado, redirecionar para o dashboard
    const user = getCurrentUser();
    if (user && user.trim() !== "") {
      router.push("/dashboard");
    }
  }, [router]);

  useEffect(() => {
    // Foco automático no conteúdo principal
    if (mainRef.current) {
      mainRef.current.focus();
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#181818] to-[#FFFFFF]">
      <div
        ref={mainRef}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4 outline-none"
        tabIndex={0}
        role="main"
        aria-label="Página de login"
      >
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <Image
              src="/Banner-logo.svg"
              alt="Logo ByteBank"
              width={120}
              height={120}
              className="max-w-full h-auto"
            />
          </div>
          <h1 className="text-2xl font-bold text-black mb-2" tabIndex={0}>
            Bem-vindo ao ByteBank
          </h1>
          <p className="text-gray-800" tabIndex={0}>
            Faça login para acessar sua conta
          </p>
        </div>
        
        <LoginForm />
        
        <div className="mt-6 text-center">
          <p className="text-gray-800" tabIndex={0}>
            Não tem uma conta?{" "}
            <Link 
              href="/register" 
              className="text-pattern-green hover:underline font-semibold focus:outline focus:outline-2 focus:outline-pattern-green"
              aria-label="Criar conta"
              tabIndex={0}
            >
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}