"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/utils/usersApi";
import setCurrentUser from "@/utils/setCurrentUser";

type Props = {
  onSuccess?: () => void;
};

export default function LoginForm({ onSuccess }: Props) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await loginUser(inputEmail, inputPassword);

      const { userName, email, id } = response.user;
      const safeUser = { id, userName, email };

      setCurrentUser(safeUser);
      onSuccess?.();
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
        console.log(err.message);
      } else {
        setErrorMessage("Erro inesperado.");
      }
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <input
        name="email"
        type="email"
        placeholder="E-mail"
        className="border rounded px-3 py-2 text-black"
        value={inputEmail}
        onChange={(e) => {
          setInputEmail(e.target.value);
        }}
        required
      />
      <input
        name="senha"
        type="password"
        placeholder="Senha"
        className="border rounded px-3 py-2 text-black"
        value={inputPassword}
        onChange={(e) => {
          setInputPassword(e.target.value);
        }}
        required
      />
      {errorMessage && (
        <span className="text-red-500 text-sm">{errorMessage}</span>
      )}
      <button
        type="submit"
        className="border border-pattern-green bg-black text-pattern-green font-semibold rounded px-4 py-2 mt-2 hover:bg-pattern-green hover:text-black transition"
      >
        Entrar
      </button>
    </form>
  );
}
