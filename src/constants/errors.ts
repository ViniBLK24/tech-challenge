import { ErrorCodeEnum } from "@/types/apiErrors";

// Error messages from errorCodes the API will send
export const ERROR_CODES: Record<ErrorCodeEnum, { title: string; desc: string }> = {
  5000: { title: "Campos obrigatórios", desc: "Preencha todos os campos." },
  5001: { title: "Tipo inválido", desc: "Tipo de transferência inválido." },
  5002: {
    title: "Saldo insuficiente",
    desc: "O valor da transferência é maior do que o saldo disponível na conta. Verifique o valor e tente novamente.",
  },
};