import { Transaction } from "@/types/transactions";

export default function getTotalBalance(data: Transaction[]): number {
    const total = data.reduce(
      (value, item) =>
        item.type === "deposit" ? value + item.amount : value - item.amount,
      0
    );
    return total;
  }