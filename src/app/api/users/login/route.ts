import { readDb } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
// Handles Login

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