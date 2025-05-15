import Image from "next/image";

export default function Home() {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-black">
      {/* Logo */}
      <div className="flex items-center">
        <Image src="/logo.png" alt="Bytebank" width={120} height={32} />
      </div>
      {/* Menu */}
      <nav className="flex gap-8">
        <a href="#" className="text-white hover:text-green-400">Sobre</a>
        <a href="#" className="text-white hover:text-green-400">Serviços</a>
      </nav>
      {/* Botões */}
      <div className="flex gap-4">
        <button className="border border-green-500 text-green-500 px-4 py-2 rounded hover:bg-pattern-green hover:text-black font-semibold cursor-pointer">
  Abrir minha conta
</button>
        <button className="border border-green-500 text-green-500 px-4 py-2 rounded hover:bg-green-500 hover:text-black font-semibold cursor-pointer">
          Já tenho conta
        </button>
      </div>
    </header>
  );
}
