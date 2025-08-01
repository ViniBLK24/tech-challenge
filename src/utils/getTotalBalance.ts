import { Transaction } from "@/types/transactions";

export default function getTotalBalance(data: Transaction[]): number {
  // Handle undefined, null, or empty arrays
  if (!data || !Array.isArray(data) || data.length === 0) {
    return 0;
  }

  const total = data.reduce(
    (value, item) =>
      item.type === "deposit" ? value + item.amount : value - item.amount,
    0
  );
  return total;
}
