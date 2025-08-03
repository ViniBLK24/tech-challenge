"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { createUser } from "@/utils/usersApi";
import setCurrentUser from "@/utils/setCurrentUser";

export default function RegisterForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const registerUser: User = {
      userName: inputName,
      email: inputEmail,
      password: inputPassword,
    };

    try {
      const response = await createUser(registerUser);

      const { username, email, id } = response.result;
      const safeUser = { id, userName: username, email };
      setCurrentUser(safeUser);

      // After successful registration, automatically login the user
      try {
        const loginResponse = await fetch("/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: inputEmail, password: inputPassword }),
        });

        if (loginResponse.ok) {
          router.push("/dashboard");
        } else {
          // If auto-login fails, still redirect to dashboard (user can login manually)
          router.push("/dashboard");
        }
      } catch (loginError) {
        console.error("Auto-login failed:", loginError);
        // Still redirect to dashboard
        router.push("/dashboard");
      }
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
        console.log(err.message);
      } else {
        setErrorMessage("Erro inesperado.");
      }
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <label htmlFor="name-register" className="sr-only" lang="pt-BR">
        Nome
      </label>
      <input
        id="name-register"
        name="nome"
        type="text"
        placeholder="Nome inteiro"
        aria-label="Nome"
        className="border rounded px-3 py-2 text-black"
        value={inputName}
        onChange={(e) => setInputName(e.target.value)}
        required
        autoComplete="name"
        aria-describedby="register-error"
      />
      <label htmlFor="email-register" className="sr-only" lang="pt-BR">
        E-mail
      </label>
      <input
        id="email-register"
        name="email"
        type="email"
        placeholder="E-mail"
        aria-label="E-mail"
        className="border rounded px-3 py-2 text-black"
        value={inputEmail}
        onChange={(e) => setInputEmail(e.target.value)}
        required
        autoComplete="email"
        aria-describedby="register-error"
      />
      <label htmlFor="password-register" className="sr-only" lang="pt-BR">
        Senha
      </label>
      <input
        id="password-register"
        name="senha"
        type="password"
        placeholder="Senha"
        aria-label="Senha"
        className="border rounded px-3 py-2 text-black"
        value={inputPassword}
        onChange={(e) => setInputPassword(e.target.value)}
        required
        autoComplete="new-password"
        aria-describedby="register-error"
      />
      {errorMessage && (
        <span
          id="register-error"
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
        Criar conta
      </button>
    </form>
  );
}
