"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"abrir" | "login" | null>(null);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");

  // Abrir modal
  const handleOpenModal = (type: "abrir" | "login") => {
    setModalType(type);
    setModalOpen(true);
    setSidebarOpen(false);
    setLoginError("");
    setRegisterError("");
  };

  // Fechar modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalType(null);
    setLoginError("");
    setRegisterError("");
  };

  // Cadastro de usuário (vários usuários)
  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const nome = (form.elements.namedItem("nome") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const senha = (form.elements.namedItem("senha") as HTMLInputElement).value;

    // Busca usuários existentes
    const usersRaw = localStorage.getItem("users");
    const users = usersRaw ? JSON.parse(usersRaw) : [];

    // Verifica se já existe usuário com esse email
    if (users.some((u: any) => u.email === email)) {
      setRegisterError("E-mail já cadastrado.");
      return;
    }

    // Salva novo usuário
    users.push({ nome, email, senha });
    localStorage.setItem("users", JSON.stringify(users));
    handleCloseModal();
    router.push("/dashboard");
  };

  // Login de usuário
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const senha = (form.elements.namedItem("senha") as HTMLInputElement).value;

    const usersRaw = localStorage.getItem("users");
    const users = usersRaw ? JSON.parse(usersRaw) : [];

    const user = users.find((u: any) => u.email === email && u.senha === senha);

    if (user) {
      handleCloseModal();
      router.push("/dashboard");
    } else {
      setLoginError("E-mail ou senha inválidos.");
    }
  };

  return (
    <>
      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg p-8 max-w-sm w-full relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-3 text-2xl text-gray-500 hover:text-black"
              onClick={handleCloseModal}
              aria-label="Fechar modal"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-black">
              {modalType === "abrir" ? "Abrir minha conta" : "Já tenho conta"}
            </h2>
            {modalType === "abrir" ? (
              <form className="flex flex-col gap-4" onSubmit={handleRegister}>
                <input
                  name="nome"
                  type="text"
                  placeholder="Primeiro nome"
                  className="border rounded px-3 py-2 text-black"
                  required
                />
                <input
                  name="email"
                  type="email"
                  placeholder="E-mail"
                  className="border rounded px-3 py-2 text-black"
                  required
                />
                <input
                  name="senha"
                  type="password"
                  placeholder="Senha"
                  className="border rounded px-3 py-2 text-black"
                  required
                />
                {registerError && (
                  <span className="text-red-500 text-sm">{registerError}</span>
                )}
                <button
                  type="submit"
                  className="border border-pattern-green bg-black text-pattern-green font-semibold rounded px-4 py-2 mt-2 hover:bg-pattern-green hover:text-black transition"
                >
                  Criar conta
                </button>
              </form>
            ) : (
              <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                <input
                  name="email"
                  type="email"
                  placeholder="E-mail"
                  className="border rounded px-3 py-2 text-black"
                  required
                />
                <input
                  name="senha"
                  type="password"
                  placeholder="Senha"
                  className="border rounded px-3 py-2 text-black"
                  required
                />
                {loginError && (
                  <span className="text-red-500 text-sm">{loginError}</span>
                )}
                <button
                  type="submit"
                  className="border border-pattern-green bg-black text-pattern-green font-semibold rounded px-4 py-2 mt-2 hover:bg-pattern-green hover:text-black transition"
                >
                  Entrar
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Botão de menu só no mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-black text-pattern-green p-2 rounded cursor-pointer"
        onClick={() => setSidebarOpen(true)}
        aria-label="Abrir menu"
      >
        &#9776;
      </button>

      {/* Sidebar mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex">
          <nav className="bg-black w-64 h-full p-6 flex flex-col gap-6 shadow-lg">
            <button
              className="self-end text-pattern-green text-2xl hover:text-white cursor-pointer"
              onClick={() => setSidebarOpen(false)}
              aria-label="Fechar menu"
            >
              &times;
            </button>
            <a
              href="#"
              className="text-pattern-green text-lg font-semibold px-2 py-1 rounded w-fit hover:bg-pattern-green/20 hover:text-white transition"
              onClick={() => setSidebarOpen(false)}
            >
              Sobre
            </a>
            <a
              href="#"
              className="text-pattern-green text-lg font-semibold px-2 py-1 rounded w-fit hover:bg-pattern-green/20 hover:text-white transition"
              onClick={() => setSidebarOpen(false)}
            >
              Serviços
            </a>
            {/* Botões só no mobile */}
            <div className="flex flex-col gap-2 mt-4 md:hidden">
              <button
                className="border border-pattern-green text-pattern-green px-3 py-2 rounded hover:bg-pattern-green hover:text-black font-semibold cursor-pointer text-sm"
                onClick={() => handleOpenModal("abrir")}
              >
                Abrir minha conta
              </button>
              <button
                className="border border-pattern-green text-pattern-green px-3 py-2 rounded hover:bg-pattern-green hover:text-black font-semibold cursor-pointer text-sm"
                onClick={() => handleOpenModal("login")}
              >
                Já tenho conta
              </button>
            </div>
          </nav>
          {/* Clique fora fecha o menu */}
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Header */}
      <Header onOpenModal={handleOpenModal} />

      {/* Main */}
      <main className="flex flex-col items-center justify-center py-10 md:py-16 bg-gradient-to-b from-[#EBE8ED] to-[#FFFFFF] min-h-[60vh] w-full">
        <div className="w-full max-w-4xl flex flex-col md:flex-row items-center gap-8 px-4">
          <div className="flex-1 flex items-start w-full">
            <h1 className="text-xl md:text-2xl font-bold text-black mb-4 text-left w-full">
              Experimente mais liberdade no controle da sua vida financeira.<br />
              Crie sua conta com a gente!
            </h1>
          </div>
          <div className="flex-1 flex justify-center w-full md:ml-20">
            <Image
              src="/Banner-logo.svg"
              alt="Ilustração Bytebank"
              width={300}
              height={300}
              className="max-w-full h-auto"
            />
          </div>
        </div>
        <section className="w-full max-w-5xl mt-12 md:mt-16 px-2">
          <h2 className="text-lg md:text-xl font-bold text-black text-left mb-8">
            Vantagens do nosso banco:
          </h2>
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-8
              text-left
            "
          >
            <div>
              <div className="flex justify-center md:justify-start mb-2">
                <Image
                  src="/gift.svg"
                  alt="gift icon"
                  width={48}
                  height={48}
                />
              </div>
              <h3 className="font-semibold text-black text-center md:text-left">Conta e cartão gratuitos</h3>
              <p className="text-sm text-black mt-1 text-center md:text-left">
                Isso mesmo, nossa conta é digital, sem custo fixo e mais: uso grátis, sem tarifa de manutenção.
              </p>
            </div>
            <div>
              <div className="flex justify-center md:justify-start mb-2">
                <Image
                  src="/dollar-sign.svg"
                  alt="dollar icon"
                  width={48}
                  height={48}
                />
              </div>
              <h3 className="font-semibold text-black text-center md:text-left">Saques sem custo</h3>
              <p className="text-sm text-black mt-1 text-center md:text-left">
                Você pode sacar gratuitamente 4x por mês de qualquer Banco 24h.
              </p>
            </div>
            <div>
              <div className="flex justify-center md:justify-start mb-2">
                <Image
                  src="/star.svg"
                  alt="star icon"
                  width={48}
                  height={48}
                />
              </div>
              <h3 className="font-semibold text-black text-center md:text-left">Programa de pontos</h3>
              <p className="text-sm text-black mt-1 text-center md:text-left">
                Você pode acumular pontos com suas compras no crédito sem pagar mensalidade!
              </p>
            </div>
            <div>
              <div className="flex justify-center md:justify-start mb-2">
                <Image
                  src="/laptop.svg"
                  alt="laptop icon"
                  width={48}
                  height={48}
                />
              </div>
              <h3 className="font-semibold text-black text-center md:text-left">Seguro Dispositivos</h3>
              <p className="text-sm text-black mt-1 text-center md:text-left">
                Seus dispositivos móveis (computador e laptop) protegidos por uma mensalidade simbólica.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}