import { Card, CardContent } from "./ui/Card";
import Link from "next/link";

export default function SideMenu() {
  return (
    <>
      <Card className="hidden lg:block h-[100%]">
        <CardContent className="p-2 py-8 flex flex-col gap-y-3 mt-6 md:px-3 md:items-start">
          <nav className="w-[100%]">
            <ul className="flex flex-col items-center gap-3">
              <li className="font-bold">
                <Link href="/dashboard">Início</Link>
              </li>
              <MenuLine />
              <li>
                <Link href="/dashboard">Transferências</Link>
              </li>
              <MenuLine />
              <li>
                <Link href="/investments">Investimentos</Link>
              </li>
              <MenuLine />
              <li className="text-center">
                <Link href="/dashboard">Outros serviços</Link>
              </li>
            </ul>
          </nav>
        </CardContent>
      </Card>
    </>
  );
}

function MenuLine() {
  return (
    <li className="w-[100%] px-8">
      <hr className="border-[#EBE8ED] border-1 w-[100%]" aria-hidden="true" />
    </li>
  );
}
