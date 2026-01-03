import { NextRequest, NextResponse } from "next/server";

export function getAuthToken(request: NextRequest): string | null {
  const token = request.cookies.get("auth-token")?.value;
  return token || null;
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
