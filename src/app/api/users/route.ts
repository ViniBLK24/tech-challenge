import { NextRequest, NextResponse } from "next/server";
import { RegisterResponse, BackendError } from "@/shared/types/auth";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;


export async function POST(req: NextRequest) {
  const { userName, email, password } = await req.json();

  if (!userName || !email || !password) {
    return NextResponse.json(
      { error: "Campos são obrigatórios." },
      { status: 400 }
    );
  }

  try {
    // Call backend API
    const response = await fetch(`${BACKEND_API_URL}/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: userName,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data as BackendError;
      return NextResponse.json(
        { error: error.message || error.error || "Erro ao criar usuário." },
        { status: response.status }
      );
    }

    const registerData = data as RegisterResponse;

    return NextResponse.json({
      message: "Usuário cadastrado com sucesso.",
      user: {
        id: registerData.result.id,
        userName: registerData.result.username,
        email: registerData.result.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}