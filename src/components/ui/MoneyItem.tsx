import { TransactionTypeEnum } from "@/types/transactions";
import { currencyFormatter } from "@/utils/currencyFormatter";

export default function MoneyItem({
  value,
  type,
}: {
  value: string;
  type: TransactionTypeEnum;
}) {
  const formatValue = (value: string) => {
    if (type === TransactionTypeEnum.TRANSFER) {
      return `-R$ ${convertToReal(value)}`;
    }
    return `R$ ${convertToReal(value)}`;
  };

  const convertToReal = (value: string) => {
    const realValue = currencyFormatter(value);
    return realValue;
  };
  return (
    <p>
      <span className="text-medium font-bold"> {formatValue(value)}</span>
    </p>
  );
}
