import { Transaction } from "@/domain/entities";

export interface ITransactionRepository {
  findAll(userId?: string): Promise<Transaction[]>;
  findById(id: number): Promise<Transaction | undefined>;
  create(transaction: Transaction): Promise<Transaction>;
  update(id: number, transaction: Partial<Transaction>): Promise<Transaction>;
  delete(id: number): Promise<void>;
}

