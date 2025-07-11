import { User } from "@/types/user";
import { promises as fileSystem } from "fs";
import { NextRequest, NextResponse } from "next/server";
// Handles Login

// Read file from system (cwd => current working directory)
const FILE_PATH = process.cwd() + "/src/database/db.json";

async function readDb(): Promise<{ users: User[] }> {
  const data = await fileSystem.readFile(FILE_PATH, "utf-8");
  return JSON.parse(data);
}

// Login user
export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email e senha são obrigatórios." },
      { status: 400 }
    );
  }

  const db = await readDb();
  const user = db.users.find(
    (u) =>
      String(u.email).toLowerCase() === String(email).toLowerCase() &&
      String(u.password) === String(password)
  );

  if (!user) {
    return NextResponse.json(
      { error: "Usuário ou senha inválidos." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    message: "Login realizado com sucesso.",
    user: {
      id: user.id,
      userName: user.userName,
      email: user.email,
    },
  });
}