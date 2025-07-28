export enum TransactionTypeEnum {
  DEPOSIT = "deposit",
  TRANSFER = "transfer",
}

export type Transaction = {
  id?: number;
  type: TransactionTypeEnum;
  amount: number;
  createdAt: string;
  name: string; // Novo campo
};
