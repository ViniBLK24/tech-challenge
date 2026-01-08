import { Transaction, TransactionTypeEnum } from "../../entities/transaction.entity";

export class CalculateBalanceUseCase {
  execute(transactions: Transaction[]): number {
    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      return 0;
    }

    const total = transactions.reduce(
      (value, item) =>
        item.type === TransactionTypeEnum.DEPOSIT ? value + item.amount : value - item.amount,
      0
    );
    return total;
  }
}

