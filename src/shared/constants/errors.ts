import { ErrorCodeEnum } from "@/domain/constants/errors";

// Error messages from errorCodes the API will send
export const ERROR_CODES: Record<
  ErrorCodeEnum,
  { title: string; description: string }
> = {
  5000: {
    title: "Campos obrigatórios",
    description: "Preencha todos os campos.",
  },
  5001: {
    title: "Tipo inválido",
    description: "Tipo de transferência inválido.",
  },
  5002: {
    title: "Saldo insuficiente",
    description:
      "O valor da transferência é maior do que o saldo disponível na conta. Verifique o valor e tente novamente.",
  },
  5003: {
    title: "Transação não encontrada",
    description: "A transação que você está tentando acessar não existe.",
  },
  5004: {
    title: "Formato do arquivo é inválido",
    description: "Envie um arquivo no formato JPG, PNG ou PDF.",
  },
  5005: {
    title: "Arquivo muito grande",
    description:
      "O arquivo selecionado ultrapassa o limite de 1MB. Escolha um arquivo menor e tente novamente.",
  },
};
