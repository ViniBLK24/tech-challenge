import { User } from "@/types/user";
import { Transaction } from "@/types/transactions";
import { promises as fileSystem } from "fs";

const FILE_PATH = process.cwd() + "/src/database/db.json";

export type Database = {
  users: User[];
  transactions: Transaction[];
};

// Read the JSON file and ensure structure exists
export async function readDb(): Promise<Database> {
  try {
    const file = await fileSystem.readFile(FILE_PATH, "utf-8");
    const parsed = JSON.parse(file);

    return {
      users: parsed.users ?? [],
      transactions: parsed.transactions ?? [],
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    // If file doesn't exist or is malformed, return empty db
    return {
      users: [],
      transactions: [],
    };
  }
}

// Write to the file (overwrites the whole db)
export async function writeDb(updatedDb: Database): Promise<void> {
  await fileSystem.writeFile(FILE_PATH, JSON.stringify(updatedDb, null, 2));
}
