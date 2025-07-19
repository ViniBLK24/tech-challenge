import { User } from "@/types/user";

const USER_API_URL = "/api/users";
const LOGIN_API_URL = "/api/users/login";

// Register new user
export async function createUser(user: User) {
    const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao criar usuário.");
  }

  return data;
}

// List all users
export async function getUsers() {
  const response = await fetch("/api/users");
  if (!response.ok) {
    throw new Error("Erro ao buscar usuários");
  }
  return response.json();
}

// Login user
export async function loginUser(email: string, password: string){
    const response = await fetch(LOGIN_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao logar usuário.");
  }

  return data;
}