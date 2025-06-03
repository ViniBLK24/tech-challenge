export enum TransactionTypeEnum {
  DEPOSIT = "deposit",
  TRANSFER = "transfer",
}

export interface Transaction {
  type: TransactionTypeEnum;
  amount: number;
  createdAt: string;
  id?: number;
}
