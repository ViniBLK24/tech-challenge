"use client";

import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/login/LoginForm";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#EBE8ED] to-[#FFFFFF]">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <Image
              src="/Banner-logo.svg"
              alt="ByteBank Logo"
              width={120}
              height={120}
              className="max-w-full h-auto"
            />
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">
            Bem-vindo ao ByteBank
          </h1>
          <p className="text-gray-600">
            Faça login para acessar sua conta
          </p>
        </div>
        
        <LoginForm />
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Não tem uma conta?{" "}
            <Link 
              href="/register" 
              className="text-pattern-green hover:underline font-semibold"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

