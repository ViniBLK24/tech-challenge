"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginForm from "@/components/login/LoginForm";
import RegisterForm from "@/components/login/RegisterForm";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"abrir" | "login" | null>(null);

  const handleOpenModal = (type: "abrir" | "login") => {
    setModalType(type);
    setModalOpen(true);
    setSidebarOpen(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalType(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg p-8 max-w-sm w-full relative"
            onClick={(e) => e.stopPropagation()}
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
            {modalType === "abrir" ? <RegisterForm /> : <LoginForm />}
          </div>
        </div>
      )}

      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-black text-pattern-green p-2 rounded cursor-pointer"
        onClick={() => setSidebarOpen(true)}
        aria-label="Abrir menu"
      >
        &#9776;
      </button>

      {/* Sidebar for mobile */}
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
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Header */}
      <Header onOpenModal={handleOpenModal} />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center py-10 md:py-16 bg-gradient-to-b from-[#EBE8ED] to-[#FFFFFF] w-full">
        <div className="w-full max-w-4xl flex flex-col md:flex-row items-center gap-8 px-4">
          <div className="flex-1 flex items-start w-full">
            <h1 className="text-xl md:text-2xl font-bold text-black mb-4 text-left w-full">
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
          <h2 className="text-lg md:text-xl font-bold text-black text-left mb-8">
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
    <div>
      <div className="flex justify-center md:justify-start mb-2">
        <Image src={icon} alt={title} width={48} height={48} />
      </div>
      <h3 className="font-semibold text-black text-center md:text-left">
        {title}
      </h3>
      <p className="text-sm text-black mt-1 text-center md:text-left">{desc}</p>
    </div>
  );
}
