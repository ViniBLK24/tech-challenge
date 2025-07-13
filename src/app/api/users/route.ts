import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb } from "@/utils/db";

export async function POST(req: NextRequest) {
  const { userName, email, password } = await req.json();

  if (!userName || !email || !password) {
    return NextResponse.json(
      { error: "Campos são obrigatórios." },
      { status: 400 }
    );
  }

  const db = await readDb();

  const existingUser = db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (existingUser) {
    return NextResponse.json(
      { error: "Usuário já cadastrado." },
      { status: 409 }
    );
  }

  const newUser = {
    id: Date.now(),
    userName,
    email,
    password,
  };

  db.users.push(newUser);
  await writeDb(db);

  return NextResponse.json({
    message: "Usuário cadastrado com sucesso.",
    user: newUser,
  });
}
