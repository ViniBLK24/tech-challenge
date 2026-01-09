import { ErrorCodeEnum } from "@/types/apiErrors";
import { ERROR_CODES } from "@/constants/errors";

export interface ErrorMessage {
  title: string;
  description: string;
}

const NETWORK_ERROR = {
  title: "Erro de conexão",
  description: "Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.",
};

const TIMEOUT_ERROR = {
  title: "Tempo esgotado",
  description: "A operação demorou muito para ser concluída. Por favor, tente novamente.",
};

const AUTH_ERROR = {
  title: "Não autenticado",
  description: "Sua sessão expirou. Por favor, faça login novamente.",
};

const UNAUTHORIZED_ERROR = {
  title: "Acesso negado",
  description: "Você não tem permissão para realizar esta ação.",
};

const SERVER_ERROR = {
  title: "Erro no servidor",
  description: "Ocorreu um erro interno. Por favor, tente novamente mais tarde.",
};

const GENERIC_ERROR = {
  title: "Algo deu errado",
  description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
};

export function handleError(error: unknown): ErrorMessage {
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return NETWORK_ERROR;
  }

  if (error instanceof Error) {
    if (error.message.includes("timeout") || error.message.includes("aborted")) {
      return TIMEOUT_ERROR;
    }

    if (error.message.includes("401") || error.message.includes("Unauthorized")) {
      return AUTH_ERROR;
    }

    if (error.message.includes("403") || error.message.includes("Forbidden")) {
      return UNAUTHORIZED_ERROR;
    }

    if (error.message.includes("500") || error.message.includes("Internal Server Error")) {
      return SERVER_ERROR;
    }

    if (error.message.includes("NetworkError") || error.message.includes("Failed to fetch")) {
      return NETWORK_ERROR;
    }
  }

  if (typeof error === "object" && error !== null && "errorCode" in error) {
    const errorCode = error.errorCode as ErrorCodeEnum;
    if (ERROR_CODES[errorCode]) {
      return ERROR_CODES[errorCode];
    }
  }

  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status: number }).status;
    if (status === 401) {
      return AUTH_ERROR;
    }
    if (status === 403) {
      return UNAUTHORIZED_ERROR;
    }
    if (status >= 500) {
      return SERVER_ERROR;
    }
    if (status === 408 || status === 504) {
      return TIMEOUT_ERROR;
    }
  }

  return GENERIC_ERROR;
}

export function getErrorMessageFromResponse(response: { error?: string; errorCode?: ErrorCodeEnum }): ErrorMessage {
  if (response.errorCode && ERROR_CODES[response.errorCode]) {
    return ERROR_CODES[response.errorCode];
  }

  if (response.error) {
    const lowerError = response.error.toLowerCase();
    if (lowerError.includes("network") || lowerError.includes("fetch")) {
      return NETWORK_ERROR;
    }
    if (lowerError.includes("timeout")) {
      return TIMEOUT_ERROR;
    }
    if (lowerError.includes("401") || lowerError.includes("unauthorized")) {
      return AUTH_ERROR;
    }
    if (lowerError.includes("403") || lowerError.includes("forbidden")) {
      return UNAUTHORIZED_ERROR;
    }
  }

  return GENERIC_ERROR;
}

export function handleApiError(response: Response): ErrorMessage {
  if (response.status === 401) {
    return AUTH_ERROR;
  }
  if (response.status === 403) {
    return UNAUTHORIZED_ERROR;
  }
  if (response.status === 408 || response.status === 504) {
    return TIMEOUT_ERROR;
  }
  if (response.status >= 500) {
    return SERVER_ERROR;
  }
  if (response.status === 0) {
    return NETWORK_ERROR;
  }

  return GENERIC_ERROR;
}
