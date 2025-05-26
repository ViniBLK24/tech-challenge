import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "./ui/Menubar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { Menu, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardMenu() {
  return (
    <Menubar className="rounded-none bg-black border-black py-8 px-4 w-[100%] flex justify-between md:justify-center md:px-8">
      {/* Mobile hamburguer menu */}
      <div className="flex items-center justify-between h-[100%] w-[100%] pl-6 md:hidden">
        <Link href="/">
          <Image
            src="/logo-green.svg"
            alt=""
            width={120}
            height={120}
            className="z-0 pointer-events-none"
            aria-hidden="true"
          ></Image>
        </Link>
        <MenubarMenu>
          <MenubarTrigger
            className="
        bg-transparent 
        active:bg-transparent 
        focus:bg-transparent 
        hover:bg-transparent 
        data-[state=open]:bg-transparent"
          >
            <Menu className="text-primary" />
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Link href="/dashboard">Início</Link>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Transferências</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Investimentos</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Outros serviços</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </div>
      {/* Tablet and Desktop menu content */}
      <div className="hidden md:flex w-[100%] max-w-[1500px] justify-between items-center">
        <div>
          <Link href="/">
            <Image
              src="/logo-green.svg"
              alt=""
              width={150}
              height={150}
              className="z-0 pointer-events-none"
              aria-hidden="true"
            ></Image>
          </Link>
        </div>
        <div className="flex gap-6 items-center">
          <p className="text-white">Joana da Silva Oliveira</p>
          <Avatar className="border-[2.5px] border-primary">
            <AvatarImage src="" alt="User photo" />
            <AvatarFallback className="bg-transparent">
              <User className="w-10 h-10 text-primary" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </Menubar>
  );
}
