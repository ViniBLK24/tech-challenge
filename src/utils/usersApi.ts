import { User } from "@/types/user";
import { RegisterResponse, BackendError } from "@/types/auth";
import { sanitizeText } from "@/lib/sanitize";
import { handleError, handleApiError } from "@/lib/errorHandler";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

// Register new user
export async function createUser(user: User): Promise<RegisterResponse> {
  const response = await fetch(`${BACKEND_API_URL}/user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: user.userName,
      email: user.email,
      password: user.password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = handleApiError(response);
    throw new Error(errorMsg.description);
  }

  return data as RegisterResponse;
}

// Login user - now calls our internal API route that handles backend integration
export async function loginUser(email: string, password: string): Promise<{ user: { id: string; userName: string; email: string } }> {
  const response = await fetch("/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();

  if (!response.ok) {
    const errorMsg = handleApiError(response);
    throw new Error(errorMsg.description);
  }

  return data;
}

// Get account data
export async function getAccountData(): Promise<{ username: string, userId: string }> {
  const response = await fetch("/api/account", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = handleApiError(response);
    throw new Error(errorMsg.description);
  }

  const rawUsername = data.result?.account?.[0]?.username || "Usuário";
  const username = sanitizeText(rawUsername) || "Usuário";
  const userId = data.result.account?.[0]?.userId;
  
  return { username, userId };
}