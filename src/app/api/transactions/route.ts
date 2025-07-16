import { ErrorCodeEnum } from "@/types/apiErrors";
import { Transaction, TransactionTypeEnum } from "@/types/transactions";
import { readDb, writeDb } from "@/utils/db";
import getTotalBalance from "@/utils/getTotalBalance";
import { NextRequest, NextResponse } from "next/server";
// API route for handling transaction data

export async function GET(req: NextRequest) {
  const userId = Number(req.nextUrl.searchParams.get("userId"));

  if (!userId){
    return NextResponse.json(
      {
        error: "Parâmetro userId obrigatório",
        errorCode: ErrorCodeEnum.REQUIRED_FIELDS,
      },
      { status: 400 }
    );
  }

  const result = await readDb();

  const filteredTransactions = result.transactions.filter(transaction => transaction.userId === userId );

  return NextResponse.json({transactions: filteredTransactions});
}

type NewTransaction = Pick<Transaction, "type" | "amount">;

export async function POST(req: NextRequest) {
  const result = await readDb();
  const newTransaction: NewTransaction = await req.json();

  const userId = Number(req.nextUrl.searchParams.get("userId"));

  if (!userId){
    return NextResponse.json(
      {
        error: "Parâmetro userId obrigatório",
        errorCode: ErrorCodeEnum.REQUIRED_FIELDS,
      },
      { status: 400 }
    );
  }

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
        userId,
        ...newTransaction,
      },
    ],
  };
  await writeDb(updatedTransactions);
  // await fileSystem.writeFile(FILE_PATH, JSON.stringify(updatedTransactions));
  return NextResponse.json(updatedTransactions, { status: 200 });
}

export async function PUT(req: NextRequest) {
  const result = await readDb();
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
  // await fileSystem.writeFile(FILE_PATH, JSON.stringify(result));
  console.log(result)
  await writeDb(result);

  return NextResponse.json(
    {
      message: "Transação atualizada com sucesso",
      transactions: result.transactions,
    },
    { status: 200 }
  );
}

export async function DELETE(req: NextRequest) {
  const result = await readDb();

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
  await writeDb(result);

  return NextResponse.json(
    {
      message: "Transação removida com sucesso",
      transactions: result.transactions,
    },
    { status: 200 }
  );
}
