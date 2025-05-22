"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Eye, EyeClosed } from "lucide-react";
import Image from "next/image";
import BackgroundShapes from "@/components/ui/BackgroundShapes";
import { useState } from "react";
import { currencyFormatter } from "@/utils/currencyFormatter";

const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const formatCurrentDate = () => {
  const today = new Date(Date.now());

  const formattedDate = Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(today);

  return capitalizeFirstLetter(formattedDate);
};

export default function WelcomeCard({ balance }: { balance: number }) {
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  function onEyeClick() {
    setIsBalanceHidden((prev) => !prev);
  }

  return (
    <Card className="bg-black relative py-6 px-5 gap-y-8 md:grid md:grid-cols-2">
      <BackgroundShapes y="top-0" x="right-0" />
      <BackgroundShapes y="bottom-0" x="left-0" />
      <CardHeader className="flex flex-col items-center md:items-start md:gap-y-10">
        <div>
          <CardTitle className="text-white text-3xl">Olá, Joana! :)</CardTitle>
          <CardDescription className="text-md md:mt-2">
            {formatCurrentDate()}
          </CardDescription>
        </div>
        <BackgroundImage classes="hidden z-0 pointer-events-none md:block" />
      </CardHeader>
      <CardContent className="px-5 flex flex-col gap-y-3 mt-6 md:px-0 md:items-start">
        <div className="flex gap-x-4">
          <h2 className="text-white text-lg font-bold">Saldo</h2>
          <button onClick={onEyeClick} className="cursor-pointer">
            {isBalanceHidden ? (
              <EyeClosed className="text-primary" />
            ) : (
              <Eye className="text-primary" />
            )}
          </button>
        </div>
        <hr className="border-primary w-[100%] md:w-[70%]" />
        <div>
          <p className="text-white text-md">Conta Corrente</p>
          <p className="text-white font-semibold text-2xl">
            R${" "}
            {isBalanceHidden
              ? "••••••"
              : currencyFormatter((balance / 100).toFixed(2))}
          </p>
        </div>
      </CardContent>
      <BackgroundImage classes="z-1 pointer-events-none mt-4 md:hidden" />
    </Card>
  );
}

function BackgroundImage({ classes }: { classes: string }) {
  return (
    <Image
      src="/ilustracao-dashboard.svg"
      alt=""
      width={300}
      height={300}
      className={classes}
      aria-hidden="true"
    ></Image>
  );
}
