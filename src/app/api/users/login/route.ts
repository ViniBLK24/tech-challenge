import { NextRequest, NextResponse } from "next/server";
import { LoginResponse, BackendError } from "@/types/auth";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

// Login user
export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email e senha são obrigatórios." },
      { status: 400 }
    );
  }

  try {
    // Call backend API
    const response = await fetch(`${BACKEND_API_URL}/user/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data as BackendError;
      return NextResponse.json(
        { error: error.message || error.error || "Usuário ou senha inválidos." },
        { status: response.status }
      );
    }

    const loginData = data as LoginResponse;
    const token = loginData.result.token;

    // Create response with user data (without token for security)
    const responseData = NextResponse.json({
      message: "Login realizado com sucesso.",
      user: {
        id: "authenticated", // We'll get real user data from /account endpoint
        userName: "User", // Placeholder - will be updated from account data
        email: email,
      },
    });

    // Set secure HttpOnly cookie with the token
    responseData.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return responseData;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}