import { ErrorCodeEnum } from "@/types/apiErrors";

// Error messages from errorCodes the API will send
export const ERROR_CODES: Record<ErrorCodeEnum, { title: string; desc: string }> = {
  5000: { title: "Campos obrigatórios", desc: "Preencha todos os campos." },
  5001: { title: "Tipo inválido", desc: "Tipo de transferência inválido." },
  5002: {
    title: "Saldo insuficiente",
    desc: "O valor da transferência é maior do que o saldo disponível na conta. Verifique o valor e tente novamente.",
  },
  5003: { title: "Transação não encontrada", desc: "A transação que você está tentando acessar não existe."},
  5004: { title: "Formato do arquivo é inválido", desc: "Envie um arquivo no formato JPG, PNG ou PDF."},
  5005: {
  title: "Arquivo muito grande",
  desc: "O arquivo selecionado ultrapassa o limite de 1MB. Escolha um arquivo menor e tente novamente."
}
};