import { requireAuth, getAuthToken } from "@/shared/lib/auth";
import { AccountResponse, BackendError } from "@/shared/types/auth";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(req: NextRequest) {
  try {
    const authError = requireAuth(req);
    if (authError) {
      return authError;
    }

    const token = getAuthToken(req);
    const response = await fetch(`${BACKEND_API_URL}/account`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data as BackendError;
      return NextResponse.json(
        {
          error:
            error.message || error.error || "Erro ao buscar dados da conta.",
        },
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
