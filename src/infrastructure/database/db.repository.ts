import { User, Transaction } from "@/domain/entities";
import { promises as fileSystem } from "fs";

const FILE_PATH = process.cwd() + "/src/infrastructure/database/data/db.json";

export type Database = {
  users: User[];
  transactions: Transaction[];
};

export class DatabaseRepository {
  async read(): Promise<Database> {
    try {
      const file = await fileSystem.readFile(FILE_PATH, "utf-8");
      const parsed = JSON.parse(file);

      return {
        users: parsed.users ?? [],
        transactions: parsed.transactions ?? [],
      };
    } catch (err) {
      return {
        users: [],
        transactions: [],
      };
    }
  }

  async write(updatedDb: Database): Promise<void> {
    await fileSystem.writeFile(FILE_PATH, JSON.stringify(updatedDb, null, 2));
  }
}

