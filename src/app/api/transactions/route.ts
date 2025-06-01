import { ErrorCodeEnum } from "@/types/apiErrors";
import { Transaction, TransactionTypeEnum } from "@/types/transactions";
import getTotalBalance from "@/utils/getTotalBalance";
import { promises as fileSystem } from "fs";
import { NextRequest, NextResponse } from "next/server";
// API route for handling transaction data

// Read file from system (cwd => current working directory)
const FILE_PATH = process.cwd() + "/src/database/db.json";

async function getDbFile(): Promise<{ transactions: Transaction[] }> {
  const file = await fileSystem.readFile(FILE_PATH, "utf-8");
  const json = JSON.parse(file);
  return json;
}

export async function GET() {
  const result = await getDbFile();
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const result = await getDbFile();
  const newTransaction = await req.json();

  const totalBalance = getTotalBalance(result.transactions);

  if (!newTransaction.type || !newTransaction.amount) {
    // If any value is empty throw error
    return NextResponse.json(
      {
        error: "Preencha todos os campos.",
        errorCode: ErrorCodeEnum.REQUIRED_FIELDS,
      },
      { status: 400 }
    );
  } else if (
    !Object.values(TransactionTypeEnum).includes(newTransaction.type)
  ) {
    // If transaction type is not valid (based on the enum)
    return NextResponse.json(
      {
        error: "Tipo de transferência inválido.",
        errorCode: ErrorCodeEnum.INVALID_TRANSFER_TYPE,
      },
      { status: 400 }
    );
  } else if (
    newTransaction.type === TransactionTypeEnum.TRANSFER &&
    newTransaction.amount > totalBalance
  ) {
    // If transfer amount is bigger than total balance
    return NextResponse.json(
      {
        error: "Saldo insuficiente.",
        errorCode: ErrorCodeEnum.INSUFICIENT_FUNDS_TYPE,
      },
      { status: 400 }
    );
  }

  // Append the new transaction to the existing list and add date created and id
  const updatedTransactions = {
    ...result,
    transactions: [
      ...result.transactions,
      {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        ...newTransaction,
      },
    ],
  };
  await fileSystem.writeFile(FILE_PATH, JSON.stringify(updatedTransactions));
  return NextResponse.json(updatedTransactions, { status: 200 });
}

export async function PUT(req: NextRequest) {
  const result = await getDbFile();
  const updatedTransaction = await req.json();

  // Extrair ID da URL ou do corpo da requisição
  const transactionId = updatedTransaction.id;

  if (!transactionId) {
    return NextResponse.json(
      {
        error: "ID da transação é obrigatório.",
        errorCode: ErrorCodeEnum.REQUIRED_FIELDS,
      },
      { status: 400 }
    );
  }

  // Encontrar a transação existente
  const transactionIndex = result.transactions.findIndex(
    (transaction: Transaction) => transaction.id === transactionId
  );

  if (transactionIndex === -1) {
    return NextResponse.json(
      {
        error: "Transação não encontrada.",
        errorCode: ErrorCodeEnum.TRANSACTION_NOT_FOUND,
      },
      { status: 404 }
    );
  }

  // Validações similares ao POST
  if (!updatedTransaction.type || !updatedTransaction.amount) {
    return NextResponse.json(
      {
        error: "Preencha todos os campos.",
        errorCode: ErrorCodeEnum.REQUIRED_FIELDS,
      },
      { status: 400 }
    );
  }

  if (!Object.values(TransactionTypeEnum).includes(updatedTransaction.type)) {
    return NextResponse.json(
      {
        error: "Tipo de transferência inválido.",
        errorCode: ErrorCodeEnum.INVALID_TRANSFER_TYPE,
      },
      { status: 400 }
    );
  }

  // Calcular saldo sem a transação atual (para validação de saldo)
  const transactionsWithoutCurrent = result.transactions.filter(
    (transaction: Transaction) => transaction.id !== transactionId
  );
  const totalBalance = getTotalBalance(transactionsWithoutCurrent);

  if (
    updatedTransaction.type === TransactionTypeEnum.TRANSFER &&
    updatedTransaction.amount > totalBalance
  ) {
    return NextResponse.json(
      {
        error: "Saldo insuficiente.",
        errorCode: ErrorCodeEnum.INSUFICIENT_FUNDS_TYPE,
      },
      { status: 400 }
    );
  }

  // Atualizar a transação mantendo dados originais como createdAt
  const originalTransaction = result.transactions[transactionIndex];
  result.transactions[transactionIndex] = {
    ...originalTransaction,
    ...updatedTransaction,
    updatedAt: new Date().toISOString(),
  };

  // Salvar arquivo atualizado
  await fileSystem.writeFile(FILE_PATH, JSON.stringify(result));

  return NextResponse.json(
    {
      message: "Transação atualizada com sucesso",
      transactions: (result.transactions = result.transactions),
    },
    { status: 200 }
  );
}

export async function DELETE(req: NextRequest) {
  const result = await getDbFile();

  // Extrair ID da URL (assumindo que será passado como query parameter)
  const url = new URL(req.url);
  const transactionId = Number(url.searchParams.get("id"));

  if (!transactionId) {
    return NextResponse.json(
      {
        error: "ID da transação é obrigatório.",
        errorCode: ErrorCodeEnum.REQUIRED_FIELDS,
      },
      { status: 400 }
    );
  }

  // Converter para número se necessário
  const id = transactionId;

  // Encontrar a transação
  const transactionIndex = result.transactions.findIndex(
    (transaction: Transaction) => transaction.id === id
  );

  if (transactionIndex === -1) {
    return NextResponse.json(
      {
        error: "Transação não encontrada.",
        errorCode: ErrorCodeEnum.TRANSACTION_NOT_FOUND,
      },
      { status: 404 }
    );
  }
  // Remover transação do array
  result.transactions.splice(transactionIndex, 1);

  // Salvar arquivo atualizado
  await fileSystem.writeFile(FILE_PATH, JSON.stringify(result));

  return NextResponse.json(
    {
      message: "Transação removida com sucesso",
      transactions: result.transactions,
    },
    { status: 200 }
  );
}
