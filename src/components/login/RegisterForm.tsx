"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  return (
    <form className="flex flex-col gap-4">
      <input
        name="nome"
        type="text"
        placeholder="Primeiro nome"
        className="border rounded px-3 py-2 text-black"
        value={inputName}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="E-mail"
        className="border rounded px-3 py-2 text-black"
        value={inputEmail}
        required
      />
      <input
        name="senha"
        type="password"
        placeholder="Senha"
        className="border rounded px-3 py-2 text-black"
        value={inputPassword}
        required
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
      <button
        type="submit"
        className="border border-pattern-green bg-black text-pattern-green font-semibold rounded px-4 py-2 mt-2 hover:bg-pattern-green hover:text-black transition"
      >
        Criar conta
      </button>
    </form>
  );
}
