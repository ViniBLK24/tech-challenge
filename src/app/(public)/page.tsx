"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginForm from "@/components/login/LoginForm";
import RegisterForm from "@/components/login/RegisterForm";
import Image from "next/image";
import { useRouter } from "next/navigation";
import getCurrentUser from "@/utils/getCurrentUser";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"abrir" | "login" | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleOpenModal = (type: "abrir" | "login") => {
    setModalType(type);
    setModalOpen(true);
    setSidebarOpen(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalType(null);
  };

  const router = useRouter();

  useEffect(() => {
    // Se o usuário já estiver logado, redirecionar para o dashboard
    const user = getCurrentUser();
    if (user && user.trim() !== "") {
      router.push("/dashboard");
    }
  }, [router]);

  // Foco automático no modal e fechamento com ESC
  useEffect(() => {
    if (modalOpen && modalRef.current) {
      modalRef.current.focus();
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") handleCloseModal();
      };
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, [modalOpen]);

  return (
    <div className="flex flex-col min-h-screen bg-[#181818] text-[#111]">
      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          tabIndex={-1}
          onClick={handleCloseModal}
        >
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-8 max-w-sm w-full relative outline-none"
            onClick={(e) => e.stopPropagation()}
            tabIndex={0}
          >
            <button
              className="absolute top-2 right-3 text-2xl text-gray-700 hover:text-black"
              onClick={handleCloseModal}
              aria-label="Fechar modal"
              tabIndex={0}
            >
              &times;
            </button>
            <h2
              id="modal-title"
              className="text-xl font-bold mb-4 text-black"
              tabIndex={0}
            >
              {modalType === "abrir" ? "Abrir minha conta" : "Já tenho conta"}
            </h2>
            {modalType === "abrir" ? <RegisterForm /> : <LoginForm />}
          </div>
        </div>
      )}

      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-black text-pattern-green p-2 rounded cursor-pointer focus:outline focus:outline-2 focus:outline-pattern-green"
        onClick={() => setSidebarOpen(true)}
        aria-label="Abrir menu"
        tabIndex={0}
      >
        &#9776;
      </button>

      {/* Sidebar for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-40 flex" role="navigation" aria-label="Menu lateral">
          <nav className="bg-black w-64 h-full p-6 flex flex-col gap-6 shadow-lg" tabIndex={0}>
            <button
              className="self-end text-pattern-green text-2xl hover:text-white cursor-pointer focus:outline focus:outline-2 focus:outline-pattern-green"
              onClick={() => setSidebarOpen(false)}
              aria-label="Fechar menu"
              tabIndex={0}
            >
              &times;
            </button>
            <a
              href="#"
              className="text-pattern-green text-lg font-semibold px-2 py-1 rounded w-fit hover:bg-pattern-green/20 hover:text-white transition focus:outline focus:outline-2 focus:outline-pattern-green"
              onClick={() => setSidebarOpen(false)}
              aria-label="Sobre"
              tabIndex={0}
            >
              Sobre
            </a>
            <a
              href="#"
              className="text-pattern-green text-lg font-semibold px-2 py-1 rounded w-fit hover:bg-pattern-green/20 hover:text-white transition focus:outline focus:outline-2 focus:outline-pattern-green"
              onClick={() => setSidebarOpen(false)}
              aria-label="Serviços"
              tabIndex={0}
            >
              Serviços
            </a>
            <div className="flex flex-col gap-2 mt-4 md:hidden">
              <button
                className="border border-pattern-green text-pattern-green px-3 py-2 rounded hover:bg-pattern-green hover:text-black font-semibold cursor-pointer text-sm focus:outline focus:outline-2 focus:outline-pattern-green"
                onClick={() => handleOpenModal("abrir")}
                aria-label="Abrir minha conta"
                tabIndex={0}
              >
                Abrir minha conta
              </button>
              <button
                className="border border-pattern-green text-pattern-green px-3 py-2 rounded hover:bg-pattern-green hover:text-black font-semibold cursor-pointer text-sm focus:outline focus:outline-2 focus:outline-pattern-green"
                onClick={() => handleOpenModal("login")}
                aria-label="Já tenho conta"
                tabIndex={0}
              >
                Já tenho conta
              </button>
            </div>
          </nav>
          <div className="flex-1" onClick={() => setSidebarOpen(false)} tabIndex={0} aria-label="Fechar menu lateral" />
        </div>
      )}

      {/* Header */}
      <Header onOpenModal={handleOpenModal} />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center py-10 md:py-16 bg-gradient-to-b from-[#EBE8ED] to-[#FFFFFF] w-full">
        <div className="w-full max-w-4xl flex flex-col md:flex-row items-center gap-8 px-4">
          <div className="flex-1 flex items-start w-full">
            <h1 className="text-xl md:text-2xl font-bold text-black mb-4 text-left w-full" tabIndex={0}>
              Experimente mais liberdade no controle da sua vida financeira.
              <br />
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
          <h2 className="text-lg md:text-xl font-bold text-black text-left mb-8" tabIndex={0}>
            Vantagens do nosso banco:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            <Feature
              icon="/gift.svg"
              title="Conta e cartão gratuitos"
              desc="Sem tarifa de manutenção."
            />
            <Feature
              icon="/dollar-sign.svg"
              title="Saques sem custo"
              desc="Grátis 4x por mês em Banco 24h."
            />
            <Feature
              icon="/star.svg"
              title="Programa de pontos"
              desc="Acumule pontos sem mensalidade."
            />
            <Feature
              icon="/laptop.svg"
              title="Seguro Dispositivos"
              desc="Proteção simbólica para seus dispositivos."
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div tabIndex={0} role="region" aria-label={title} className="outline-none">
      <div className="flex justify-center md:justify-start mb-2">
        <Image src={icon} alt={title} width={48} height={48} />
      </div>
      <h3 className="font-semibold text-black text-center md:text-left" tabIndex={0}>
        {title}
      </h3>
      <p className="text-sm text-black mt-1 text-center md:text-left" tabIndex={0}>{desc}</p>
    </div>
  );
}

