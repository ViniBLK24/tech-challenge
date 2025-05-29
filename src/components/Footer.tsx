import Image from "next/image";

export default function Footer() {
  return (
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
  );
}