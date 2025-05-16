import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button, buttonVariants } from "./ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Toaster } from "./ui/Sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";
import BackgroundShapes from "./ui/BackgroundShapes";

export default function TransactionActions() {
  return (
    <Card className="bg-[#F5F5F5] relative pt-5 pb-0 md:h-[490px]">
      <BackgroundShapes y="top-0" x="right-0" />

      <BackgroundShapes y="bottom-0" x="left-0" />

      <div className="flex flex-col md:w-[60%] md:px-5 md:gap-4 lg:w-[55%]">
        <CardHeader className="flex flex-col items-center md:items-start">
          <CardTitle className="text-3xl">Nova transação</CardTitle>
        </CardHeader>

        <CardContent>
          {/* Transaction form */}
          <form className="flex flex-col gap-y-8 mt-3 md:mt-0">
            <Select>
              <SelectTrigger className="w-[100%] z-1 cursor-pointer">
                <SelectValue placeholder="Selecione o tipo de transação" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="transfer" className="cursor-pointer">
                  Transferência
                </SelectItem>

                <SelectItem value="deposit" className="cursor-pointer">
                  Depósito
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="flex flex-col gap-y-3">
              <Label htmlFor="valor" className="">
                Valor
              </Label>

              <Input
                id="valor"
                type="number"
                min="0"
                step="0.01"
                className="w-[50%] md:w-[100%]"
                placeholder="00,00"
              />
            </div>

            <Button
              type="submit"
              className={cn(
                buttonVariants({ size: "lg" }),

                "bg-black text-white w-[100%] cursor-pointer hover:text-white hover:bg-neutral-500 md:w-[70%] md:min-w-50"
              )}
            >
              Concluir transação
            </Button>

            <Toaster />
          </form>

          <Image
            src="/ilustracao-nova-transacao.svg"
            alt="Ilustração de uma mulher segurando um cartão de crédito"
            height={300}
            width={300}
            className="z-0 pointer-events-none -mb-5 md:hidden"
          ></Image>
        </CardContent>
      </div>

      <div className="hidden md:block md:absolute md:w-85 md:h-60 md:bottom-0 md:right-6 md:min-w-[50%] lg:right-10 lg:w-95 lg:h-65">
        <Image
          src="/ilustracao-nova-transacao.svg"
          alt="Ilustração de uma mulher segurando um cartão de crédito"
          fill
          className="z-0 pointer-events-none"
        ></Image>
      </div>
    </Card>
  );
}
