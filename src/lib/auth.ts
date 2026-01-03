import { NextRequest, NextResponse } from "next/server";
import { AccountResponse } from "@/types/auth";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.BACKEND_API_URL;

export function getAuthToken(request: NextRequest): string | null {
  const token = request.cookies.get("auth-token")?.value;
  return token || null;
}

export async function getUserIdFromToken(token: string): Promise<string | null> {
  try {
    if (!BACKEND_API_URL) {
      return null;
    }

    const response = await fetch(`${BACKEND_API_URL}/account`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const accountData = data as AccountResponse;
    const userId = accountData.result?.account?.[0]?.userId;
    return userId ? String(userId) : null;
  } catch (error) {
    return null;
  }
}

export function requireAuth(request: NextRequest): NextResponse | null {
  const token = getAuthToken(request);
  
  if (!token) {
    return NextResponse.json(
      { error: "Token de autenticação não encontrado." },
      { status: 401 }
    );
  }
  
  return null;
}

export async function requireAuthorization(
  request: NextRequest,
  requestUserId: string
): Promise<NextResponse | null> {
  const authError = requireAuth(request);
  if (authError) {
    return authError;
  }

  const token = getAuthToken(request);
  if (!token) {
    return NextResponse.json(
      { error: "Token de autenticação não encontrado." },
      { status: 401 }
    );
  }

  const authenticatedUserId = await getUserIdFromToken(token);
  
  if (!authenticatedUserId) {
    return NextResponse.json(
      { error: "Token de autenticação inválido." },
      { status: 401 }
    );
  }

  if (authenticatedUserId !== requestUserId) {
    return NextResponse.json(
      { error: "Acesso negado. Você não tem permissão para acessar este recurso." },
      { status: 403 }
    );
  }

  return null;
}
