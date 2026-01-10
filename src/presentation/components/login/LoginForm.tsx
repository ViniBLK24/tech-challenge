"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logger } from "@/shared/lib/logger";
import { handleError } from "@/shared/lib/errorHandler";
import { loginUser } from "@/presentation/api/users.api";
import setCurrentUser from "@/shared/lib/setCurrentUser";

export default function LoginForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputEmail)) {
      setErrorMessage("Por favor, insira um email válido.");
      return;
    }

    if (inputPassword.length < 8) {
      setErrorMessage("A senha deve ter no mínimo 8 caracteres.");
      return;
    }

    try {
      const response = await loginUser(inputEmail, inputPassword);

      const { userName, email, id } = response.user;
      const safeUser = { id, userName, email };

      setCurrentUser(safeUser.id);
      router.push("/dashboard");
    } catch (err) {
      const errorMsg = handleError(err);
      setErrorMessage(errorMsg.description);
      logger.error(err);
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <label htmlFor="email-login" className="sr-only" lang="pt-BR">
        E-mail
      </label>
      <input
        id="email-login"
        name="email"
        type="email"
        placeholder="E-mail"
        aria-label="E-mail"
        className="border rounded px-3 py-2 text-black"
        value={inputEmail}
        onChange={(e) => {
          setInputEmail(e.target.value);
        }}
        required
        autoComplete="email"
        aria-describedby="login-error"
      />
      <label htmlFor="password-login" className="sr-only" lang="pt-BR">
        Senha
      </label>
      <input
        id="password-login"
        name="senha"
        type="password"
        placeholder="Senha"
        aria-label="Senha"
        className="border rounded px-3 py-2 text-black"
        value={inputPassword}
        onChange={(e) => {
          setInputPassword(e.target.value);
        }}
        required
        autoComplete="current-password"
        aria-describedby="login-error"
      />
      {errorMessage && (
        <span
          id="login-error"
          className="text-red-500 text-sm"
          aria-live="assertive"
          lang="pt-BR"
        >
          {errorMessage}
        </span>
      )}
      <button
        type="submit"
        className="border border-pattern-green bg-black text-pattern-green font-semibold rounded px-4 py-2 mt-2 hover:bg-pattern-green hover:text-black transition"
        lang="pt-BR"
      >
        Entrar
      </button>
    </form>
  );
}
