import { User } from "@/types/user";
import { promises as fileSystem } from "fs";
import { NextRequest, NextResponse } from "next/server";
// Handles Registration

// Read file from system (cwd => current working directory)
const FILE_PATH = process.cwd() + "/src/database/db.json";

async function readDb(): Promise<{ users: User[] }> {
  const data = await fileSystem.readFile(FILE_PATH, "utf-8");
  const parsed = JSON.parse(data);

    // Ensure "users" always exists in json
  return {
    users: parsed.users ?? [],
  };
}

async function writeDb(updatedData: any) {
  await fileSystem.writeFile(FILE_PATH, JSON.stringify(updatedData, null, 2));
}

// List all users
export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.users);
}

// Register a new user
export async function POST(req: NextRequest) {
  const { userName, email, password } = await req.json();

  if (!userName || !email || !password) {
    return NextResponse.json(
      { error: "Campos são obrigatórios." },
      { status: 400 }
    );
  }

  const db = await readDb();

  // Check if there is already an user with the same email
  const existingUser = db.users.find(
    (u) => String(u.email).toLowerCase() === String(email).toLowerCase()
  );

  if (existingUser) {
    return NextResponse.json(
      { error: "Usuário já cadastrado." },
      { status: 409 }
    );
  }

  // Creates a new user if email is new
  const newUser = {
    id: Date.now(),
    userName: String(userName),
    email: String(email),
    password: String(password),
  };

  db.users.push(newUser);
  await writeDb(db);

  return NextResponse.json({ message: "Usuário cadastrado com sucesso.", user: newUser });
}