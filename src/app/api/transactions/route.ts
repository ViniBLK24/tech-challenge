import { NextRequest, NextResponse } from "next/server";
import { Transaction, TransactionTypeEnum } from "@/domain/entities";
import { ErrorCodeEnum } from "@/domain/constants/errors";
import { DatabaseRepository } from "@/infrastructure/database/db.repository";
import { TransactionRepository } from "@/infrastructure/repositories/transaction.repository";
import { S3Service } from "@/infrastructure/storage/s3.service";
import {
  CreateTransactionUseCase,
  GetTransactionsUseCase,
  UpdateTransactionUseCase,
  DeleteTransactionUseCase,
  CalculateBalanceUseCase,
} from "@/domain/use-cases/transactions";

export const runtime = "nodejs";

const dbRepository = new DatabaseRepository();
const transactionRepository = new TransactionRepository(dbRepository);
const s3Service = new S3Service();
const calculateBalanceUseCase = new CalculateBalanceUseCase();
const createTransactionUseCase = new CreateTransactionUseCase(
  transactionRepository,
  s3Service,
  calculateBalanceUseCase
);
const getTransactionsUseCase = new GetTransactionsUseCase(transactionRepository);
const updateTransactionUseCase = new UpdateTransactionUseCase(
  transactionRepository,
  s3Service,
  calculateBalanceUseCase
);
const deleteTransactionUseCase = new DeleteTransactionUseCase(transactionRepository, s3Service);
const MAX_FILE_SIZE = 1 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "application/pdf"];

export async function GET(req: NextRequest) {
  try {
    const userId = String(req.nextUrl.searchParams.get("userId"));
    const transactions = await getTransactionsUseCase.execute(userId);
    return NextResponse.json({ transactions });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.error || "Erro ao buscar transações",
        errorCode: error.errorCode || ErrorCodeEnum.REQUIRED_FIELDS,
      },
      { status: error.status || 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  const result = await dbRepository.read(); 
  const transactionId = Date.now();

  let userId: string = "";
  let type: string = "";
  let amount: number = 0;
  let fileUrl = "";

  const optionalFields: Record<string, string> = {};

  // Handle multipart form-data (with file)
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  userId = formData.get("userId") as string;
  type = formData.get("type") as string;
  amount = Number(formData.get("amount"));

  const userTransactions = result.transactions.filter(
  (transaction) => transaction.userId === userId
  );

  const calculateBalance = new CalculateBalanceUseCase();
  const totalBalance = calculateBalance.execute(userTransactions);

  // Checks if there is a pre-made category for inputted description
  (["description", "category"] as const).forEach((key) => {
    const value = formData.get(key);
    if (value && typeof value === "string") {
      optionalFields[key] = value;
    }
  });


  if (!userId) {
    return NextResponse.json({
      error: "Parâmetro userId obrigatório",
      errorCode: ErrorCodeEnum.REQUIRED_FIELDS,
    }, { status: 400 });
  }

  if (file && typeof file !== "string") {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Tipo de arquivo inválido.", errorCode: ErrorCodeEnum.INVALID_UPLOAD_FORMAT }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Arquivo muito grande (limite 1MB).", errorCode: ErrorCodeEnum.UPLOAD_FILE_TOO_BIG }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    fileUrl = await s3Service.uploadFile(buffer, transactionId.toString(), file.type);
  }

  // Basic validations
  if (!type || !amount) {
    // If any value is empty throw error
    return NextResponse.json({
      error: "Preencha todos os campos.",
      errorCode: ErrorCodeEnum.REQUIRED_FIELDS,
    }, { status: 402 });
  }

  if (!Object.values(TransactionTypeEnum).includes(type as TransactionTypeEnum)) {
    // If transaction type is not valid (based on the enum)
    return NextResponse.json({
      error: "Tipo de transferência inválido.",
      errorCode: ErrorCodeEnum.INVALID_TRANSFER_TYPE,
    }, { status: 400 });
  }

  if (type === TransactionTypeEnum.TRANSFER && amount > totalBalance) {
    // If transfer amount is bigger than total balance
    return NextResponse.json({
      error: "Saldo insuficiente.",
      errorCode: ErrorCodeEnum.INSUFICIENT_FUNDS_TYPE,
    }, { status: 400 });
  }

  // Create transaction
  const newTransaction: Transaction = {
    id: transactionId,
    createdAt: new Date().toISOString(),
    userId,
    type: type as TransactionTypeEnum,
    amount,
    fileUrl,
    ...optionalFields,
  };

  // Append the new transaction to the existing list and add date created and id
  const updatedTransactions = {
    ...result,
    transactions: [...result.transactions, newTransaction],
  };

  await dbRepository.write(updatedTransactions);

  return NextResponse.json(
    { transactions: updatedTransactions.transactions },
    { status: 200 }
  );

  // const result = await dbRepository.read();
  // const transactionId = Date.now();

  // try {
  //   const formData = await req.formData();
  //   const file = formData.get("file") as File | null;
  //   const userId = formData.get("userId") as string;
  //   const type = formData.get("type") as string;
  //   const amount = Number(formData.get("amount"));

  //   const optionalFields: Record<string, string> = {};
  //   (["description", "category"] as const).forEach((key) => {
  //     const value = formData.get(key);
  //     if (value && typeof value === "string") {
  //       optionalFields[key] = value;
  //     }
  //   });

  //   const transaction: Omit<Transaction, "id" | "createdAt"> = {
  //     userId,
  //     type: type as TransactionTypeEnum,
  //     amount,
  //     ...optionalFields,
  //   };

  //   const newTransaction = await createTransactionUseCase.execute(
  //     transaction,
  //     file && typeof file !== "string" ? file : undefined
  //   );

  // const userTransactions = result.transactions.filter(
  // (transaction) => transaction.userId === userId
  // );

  // const calculateBalance = new CalculateBalanceUseCase();
  // const totalBalance = calculateBalance.execute(userTransactions);

  // (["description", "category"] as const).forEach((key) => {
  //   const value = formData.get(key);
  //   if (value && typeof value === "string") {
  //     optionalFields[key] = value;
  //   }
  // });


  // if (!userId) {
  //   return NextResponse.json({
  //     error: "Parâmetro userId obrigatório",
  //     errorCode: ErrorCodeEnum.REQUIRED_FIELDS,
  //   }, { status: 400 });
  //   const db = await dbRepository.read();
  //   return NextResponse.json({ transactions: db.transactions }, { status: 200 });
  // } catch (error: any) {
  //   return NextResponse.json(
  //     {
  //       error: error.error || "Erro ao criar transação",
  //       errorCode: error.errorCode || ErrorCodeEnum.REQUIRED_FIELDS,
  //     },
  //     { status: error.status || 400 }
  //   );
  // }
}

export async function PUT(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type");
    if (!contentType?.includes("multipart/form-data")) {
      return NextResponse.json(
        {
          error: "Formato de conteúdo inválido.",
          errorCode: ErrorCodeEnum.INVALID_UPLOAD_FORMAT,
        },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const id = Number(formData.get("id"));
    const type = formData.get("type") as string;
    const amount = Number(formData.get("amount"));
    const removeFile = formData.get("removeFile") === "true";
    const file = formData.get("file") as File | null;

    const optionalFields: Record<string, string> = {};
    (["description", "category"] as const).forEach((key) => {
      const value = formData.get(key);
      if (value && typeof value === "string") {
        optionalFields[key] = value;
      }
    });

    const updatedTransaction = await updateTransactionUseCase.execute(
      id,
      {
        type: type as TransactionTypeEnum,
        amount,
        ...optionalFields,
      },
      removeFile,
      file && typeof file !== "string" ? file : undefined
    );

    const db = await dbRepository.read();
    return NextResponse.json(
      {
        message: "Transação atualizada com sucesso",
        transactions: db.transactions,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.error || "Erro ao atualizar transação",
        errorCode: error.errorCode || ErrorCodeEnum.REQUIRED_FIELDS,
      },
      { status: error.status || 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const formData = await req.formData();
    const id = Number(formData.get("id"));

    await deleteTransactionUseCase.execute(id);

    const db = await dbRepository.read();
    return NextResponse.json(
      {
        message: "Transação removida com sucesso",
        transactions: db.transactions,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.error || "Erro ao deletar transação",
        errorCode: error.errorCode || ErrorCodeEnum.REQUIRED_FIELDS,
      },
      { status: error.status || 400 }
    );
  }
}

