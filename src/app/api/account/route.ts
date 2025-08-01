import { NextRequest, NextResponse } from "next/server";
import { AccountResponse, BackendError } from "@/types/auth";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

// Get account data
export async function GET(req: NextRequest) {
  try {
    // Get auth token from cookies
    const token = req.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Token de autenticação não encontrado." },
        { status: 401 }
      );
    }

    // Call backend API
    const response = await fetch(`${BACKEND_API_URL}/account`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data as BackendError;
      return NextResponse.json(
        { error: error.message || error.error || "Erro ao buscar dados da conta." },
        { status: response.status }
      );
    }

    const accountData = data as AccountResponse;

    return NextResponse.json({
      message: "Dados da conta carregados com sucesso.",
      result: accountData.result,
    });
  } catch (error) {
    console.error("Account fetch error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}