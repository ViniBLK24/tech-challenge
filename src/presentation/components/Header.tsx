"use client";
import Image from "next/image";

interface HeaderProps {
  onOpenModal: (type: "abrir" | "login") => void;
}

export default function Header({ onOpenModal }: HeaderProps) {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-4 bg-black gap-4 md:gap-0">
      <div className="flex items-center">
        <Image src="/logo-green.svg" alt="Bytebank" width={120} height={32} />
      </div>
      {/* Menu desktop */}
      <nav className="hidden md:flex gap-6">
        <a href="#" className="text-pattern-green hover:text-white">Sobre</a>
        <a href="#" className="text-pattern-green hover:text-white">Serviços</a>
      </nav>
      {/* Botões só em tablet/desktop */}
      <div className="hidden md:flex gap-2 md:gap-4">
        <button
          className="border border-pattern-green text-pattern-green px-3 py-2 md:px-4 md:py-2 rounded hover:bg-pattern-green hover:text-black font-semibold cursor-pointer text-sm md:text-base"
          onClick={() => onOpenModal("abrir")}
        >
          Abrir minha conta
        </button>
        <button
          className="border border-pattern-green text-pattern-green px-3 py-2 md:px-4 md:py-2 rounded hover:bg-pattern-green hover:text-black font-semibold cursor-pointer text-sm md:text-base"
          onClick={() => onOpenModal("login")}
        >
          Já tenho conta
        </button>
      </div>
    </header>
  );
}