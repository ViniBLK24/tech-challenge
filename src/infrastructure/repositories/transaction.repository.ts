import { Transaction } from "@/domain/entities";
import { DatabaseRepository } from "../database/db.repository";
import { ITransactionRepository } from "./interfaces/transaction.repository.interface";

export class TransactionRepository implements ITransactionRepository {
  constructor(private dbRepository: DatabaseRepository) {}

  async findAll(userId?: string): Promise<Transaction[]> {
    const db = await this.dbRepository.read();
    if (userId) {
      return db.transactions.filter((transaction) => transaction.userId === userId);
    }
    return db.transactions;
  }

  async findById(id: number): Promise<Transaction | undefined> {
    const db = await this.dbRepository.read();
    return db.transactions.find((transaction) => transaction.id === id);
  }

  async create(transaction: Transaction): Promise<Transaction> {
    const db = await this.dbRepository.read();
    const newTransaction: Transaction = {
      ...transaction,
      id: transaction.id || Date.now(),
      createdAt: transaction.createdAt || new Date().toISOString(),
    };
    db.transactions.push(newTransaction);
    await this.dbRepository.write(db);
    return newTransaction;
  }

  async update(id: number, transaction: Partial<Transaction>): Promise<Transaction> {
    const db = await this.dbRepository.read();
    const index = db.transactions.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error("Transaction not found");
    }
    db.transactions[index] = {
      ...db.transactions[index],
      ...transaction,
      id,
      updatedAt: new Date().toISOString(),
    };
    await this.dbRepository.write(db);
    return db.transactions[index];
  }

  async delete(id: number): Promise<void> {
    const db = await this.dbRepository.read();
    const index = db.transactions.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error("Transaction not found");
    }
    db.transactions.splice(index, 1);
    await this.dbRepository.write(db);
  }
}

