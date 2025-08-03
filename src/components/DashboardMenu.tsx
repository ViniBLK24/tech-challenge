"use client";

import { useState, useEffect } from "react";
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
import { getAccountData } from "@/utils/usersApi";

interface DashboardMenuProps {
  onLogout?: () => void;
}

export default function DashboardMenu({ onLogout }: DashboardMenuProps) {
  const [userName, setUserName] = useState("Usuário");

  useEffect(() => {
    const fetchAccountData = async () => {
        const accountData = await getAccountData();
        setUserName(accountData.username);
    };
    fetchAccountData();
  }, []);

  return (
    <Menubar
      className="sticky top-0 z-10 rounded-none bg-black border-black py-8 px-4 w-[100%] flex justify-between md:justify-center md:px-8"
      role="navigation"
      aria-live="polite"
    >
      {/* Mobile hamburguer menu */}
      <div className="flex items-center justify-between h-[100%] w-[100%] pl-6 md:hidden">
        <Link
          href="/dashboard"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.click()}
        >
          <Image
            src="/logo-green.svg"
            alt="Bytebank, ir para o início"
            width={120}
            height={120}
            aria-hidden="true"
          />
        </Link>
        <MenubarMenu>
          <MenubarTrigger
            aria-label="Abrir menu"
            className="
        bg-transparent 
        active:bg-transparent 
        focus:bg-transparent 
        hover:bg-transparent 
        data-[state=open]:bg-transparent"
            id="menu-trigger"
          >
            <Menu className="text-primary" />
          </MenubarTrigger>
          <MenubarContent
            className="max-w-[70%] -right-12 fixed z-[9999]"
            aria-labelledby="menu-trigger"
          >
            <MenubarItem className="flex gap-x-3 bg-gray-200">
              <Avatar className="border-[2.5px] border-black w-6 h-6">
                <AvatarImage src="" alt={userName} />
                <AvatarFallback className="bg-transparent">
                  <User className="w-10 h-10 text-black" />
                </AvatarFallback>
              </Avatar>
              <Link
                href="/dashboard"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && e.currentTarget.click()}
              >
                {userName}
              </Link>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Link
                href="/dashboard"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && e.currentTarget.click()}
                lang="pt-BR"
              >
                Início
              </Link>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Link
                href="#"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && e.currentTarget.click()}
                lang="pt-BR"
              >
                Transferências
              </Link>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Link
                href="#"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && e.currentTarget.click()}
                lang="pt-BR"
              >
                Investimentos
              </Link>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Link
                href="#"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && e.currentTarget.click()}
                lang="pt-BR"
              >
                Outros serviços
              </Link>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem
              onClick={() => {
                if (onLogout) onLogout();
              }}
              className="text-red-600 cursor-pointer hover:bg-red-50 active:bg-red-100"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && e.currentTarget.click()}
              lang="pt-BR"
            >
              Sair
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </div>
      {/* Tablet and Desktop menu content */}
      <div className="hidden md:flex w-[100%] max-w-[1500px] justify-between items-center">
        <div>
          <Link
            href="/dashboard"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.click()}
          >
            <Image
              src="/logo-green.svg"
              alt="Bytebank, ir para o início"
              width={150}
              height={150}
              aria-hidden="true"
            />
          </Link>
        </div>
        <div className="flex gap-6 items-center">
          <p className="text-white">{userName}</p>
          <Avatar className="border-[2.5px] border-primary">
            <AvatarImage src="" alt="" />
            <AvatarFallback className="bg-transparent">
              <User className="w-10 h-10 text-primary" />
            </AvatarFallback>
          </Avatar>
          <button
            onClick={() => {
              if (onLogout) onLogout();
            }}
            className="text-red-400 hover:text-red-300 transition-colors cursor-pointer px-3 py-1 rounded hover:bg-red-50"
            type="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.click()}
            lang="pt-BR"
          >
            Sair
          </button>
        </div>
      </div>
    </Menubar>
  );
}
