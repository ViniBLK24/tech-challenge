import { TransactionTypeEnum } from "@/types/transactions";

export default function MoneyItem({
  value,
  type,
}: {
  value: number;
  type: TransactionTypeEnum;
}) {
  const formatValue = (value: number) => {
    if (type === TransactionTypeEnum.TRANSFER) {
      return `-R$ ${convertToReal(value)}`;
    }
    return `R$ ${convertToReal(value)}`;
  };

  const convertToReal = (value: number) => {
    const realValue = Intl.NumberFormat("pt-BR", {
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
    return realValue;
  };
  return (
    <p>
      <span className="text-medium font-bold"> {formatValue(value)}</span>
    </p>
  );
}
