import { NextResponse } from "next/server";

// Logout user
export async function POST() {
  const response = NextResponse.json({
    message: "Logout realizado com sucesso.",
  });

  // Clear the auth token cookie
  response.cookies.set("auth-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0, // Expire immediately
    path: "/",
  });

  return response;
}