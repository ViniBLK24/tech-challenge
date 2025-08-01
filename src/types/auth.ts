// Types for backend API responses

export interface BackendUser {
  id: string;
  username: string;
  email: string;
}

export interface RegisterResponse {
  message: string;
  result: BackendUser;
}

export interface LoginResponse {
  message: string;
  result: {
    token: string;
  };
}

export interface AccountData {
  account: unknown[];
  transactions: unknown[];
  cards: unknown[];
}

export interface AccountResponse {
  message: string;
  result: AccountData;
}

export interface BackendError {
  message?: string;
  error?: string;
}