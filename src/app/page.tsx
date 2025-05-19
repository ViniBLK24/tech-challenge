import Image from "next/image";

export default function Home() {
  return (
    <>
      <header className="flex items-center justify-between px-8 py-4 bg-black">

        <div className="flex items-center">
          <Image src="/logo-green.svg" alt="Bytebank" width={120} height={32} />
        </div>
  
        <nav className="flex gap-8">
          <a href="#" className="text-pattern-green hover:text-white">Sobre</a>
          <a href="#" className="text-pattern-green hover:text-white">Serviços</a>
        </nav>

        <div className="flex gap-4">
          <button className="border border-pattern-green text-pattern-green px-4 py-2 rounded hover:bg-pattern-green hover:text-black font-semibold cursor-pointer">
            Abrir minha conta
          </button>
          <button className="border border-pattern-green text-pattern-green px-4 py-2 rounded hover:bg-pattern-green hover:text-black font-semibold cursor-pointer">
            Já tenho conta
          </button>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center py-16 bg-gradient-to-b from-[#EBE8ED] to-[#FFFFFF] min-h-[60vh] w-full">
        <div className="w-full max-w-4xl flex flex-row items-center gap-8">
          <div className="flex-1 flex items-start">
            <h1 className="text-2xl font-bold text-black mb-4  text-left w-full">
              Experimente mais liberdade no controle da sua vida financeira.<br />
              Crie sua conta com a gente!
            </h1>
          </div>
          <div className="flex-1 flex justify-center ml-20">
            <Image
              src="/Banner-logo.svg"
              alt="Ilustração Bytebank"
              width={400}
              height={400}
              className="max-w-full h-auto"
            />
          </div>
        </div>
        <section className="w-full max-w-5xl mt-16">
          <h2 className="text-xl font-bold text-black text-left mb-8">
            Vantagens do nosso banco:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="flex justify-center mb-2">
                <Image
                  src="gift.svg"
                  alt="gift icon"
                  width={48}
                  height={48}
                />

              </div>
              <h3 className="font-semibold text-black">Conta e cartão gratuitos</h3>
              <p className="text-sm text-black mt-1">
                Isso mesmo, nossa conta é digital, sem custo fixo e mais: uso grátis, sem tarifa de manutenção.
              </p>
            </div>
            <div>
              <div className="flex justify-center mb-2">
                <Image
                  src="dollar-sign.svg"
                  alt="dollar icon"
                  width={48}
                  height={48}
                />
              </div>
              <h3 className="font-semibold text-black">Saques sem custo</h3>
              <p className="text-sm text-black mt-1">
                Você pode sacar gratuitamente 4x por mês de qualquer Banco 24h.
              </p>
            </div>
            <div>
              <div className="flex justify-center mb-2">

                <Image
                  src="star.svg"
                  alt="star icon"
                  width={48}
                  height={48}
                />
              </div>
              <h3 className="font-semibold text-black">Programa de pontos</h3>
              <p className="text-sm text-black mt-1">
                Você pode acumular pontos com suas compras no crédito sem pagar mensalidade!
              </p>
            </div>
            <div>
              <div className="flex justify-center mb-2">
                <Image
                  src="laptop.svg"
                  alt="laptop icon"
                  width={48}
                  height={48}
                />
              </div>
              <h3 className="font-semibold text-black">Seguro Dispositivos</h3>
              <p className="text-sm text-black mt-1">
                Seus dispositivos móveis (computador e laptop) protegidos por uma mensalidade simbólica.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
