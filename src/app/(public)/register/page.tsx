"use client";

import Link from "next/link";
import RegisterForm from "@/presentation/components/login/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#EBE8ED] to-[#FFFFFF]">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-black mb-2">
            Criar Conta
          </h1>
          <p className="text-gray-600">
            Crie sua conta no ByteBank
          </p>
        </div>
        
        <RegisterForm />
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Já tem uma conta?{" "}
            <Link 
              href="/login" 
              className="text-pattern-green hover:underline font-semibold"
            >
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}