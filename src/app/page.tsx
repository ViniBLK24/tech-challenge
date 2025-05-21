"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
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
          </nav>
          {/* Clique fora fecha o menu */}
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-4 bg-black gap-4 md:gap-0">
        <div className="flex items-center">
          <Image src="/logo-green.svg" alt="Bytebank" width={120} height={32} />
        </div>
        {/* Menu desktop */}
        <nav className="hidden md:flex gap-6">
          <a href="#" className="text-pattern-green hover:text-white">Sobre</a>
          <a href="#" className="text-pattern-green hover:text-white">Serviços</a>
        </nav>
        <div className="flex gap-2 md:gap-4">
          <button
            className="border border-pattern-green text-pattern-green px-3 py-2 md:px-4 md:py-2 rounded hover:bg-pattern-green hover:text-black font-semibold cursor-pointer text-sm md:text-base"
            onClick={() => router.push("/dashboard")}
          >
            Abrir minha conta
          </button>
          <button
            className="border border-pattern-green text-pattern-green px-3 py-2 md:px-4 md:py-2 rounded hover:bg-pattern-green hover:text-black font-semibold cursor-pointer text-sm md:text-base"
            onClick={() => router.push("/dashboard")}
          >
            Já tenho conta
          </button>
        </div>
      </header>

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
              <h3 className="font-semibold text-black text-left">Conta e cartão gratuitos</h3>
              <p className="text-sm text-black mt-1 text-left">
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
              <h3 className="font-semibold text-black text-left">Saques sem custo</h3>
              <p className="text-sm text-black mt-1 text-left">
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
              <h3 className="font-semibold text-black text-left">Programa de pontos</h3>
              <p className="text-sm text-black mt-1 text-left">
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
              <h3 className="font-semibold text-black text-left">Seguro Dispositivos</h3>
              <p className="text-sm text-black mt-1 text-left">
                Seus dispositivos móveis (computador e laptop) protegidos por uma mensalidade simbólica.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-black py-10 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
          {/* Serviços */}
          <div>
            <h4 className="font-bold mb-2">Serviços</h4>
            <ul className="space-y-1 text-sm">
              <li>Conta corrente</li>
              <li>Conta PJ</li>
              <li>Cartão de crédito</li>
            </ul>
          </div>
          {/* Contato */}
          <div>
            <h4 className="font-bold mb-2">Contato</h4>
            <ul className="space-y-1 text-sm">
              <li>0800 004 250 08</li>
              <li>meajuda@bytebank.com.br</li>
              <li>ouvidoria@bytebank.com.br</li>
            </ul>
          </div>
          {/* Desenvolvido por */}
          <div className="flex flex-col items-start md:items-center mt-8 md:mt-0">
            <span className="font-bold mb-2">Desenvolvido por Alura</span>
            <div className="flex items-center mb-2">
              <Image src="/logo-white.svg" alt="Bytebank" width={100} height={28} />
            </div>
            <div className="flex gap-4 mt-2">
              <a href="#" aria-label="Instagram">
                <Image src="/instagram.svg" alt="instagram" width={24} height={24} />
              </a>
              <a href="#" aria-label="WhatsApp">
                <Image src="/whatsapp.svg" alt="whatsApp" width={24} height={24} />
              </a>
              <a href="#" aria-label="YouTube">
                <Image src="/youtube.svg" alt="youTube" width={24} height={24} className="py-1" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}