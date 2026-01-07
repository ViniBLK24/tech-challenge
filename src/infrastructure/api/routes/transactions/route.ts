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
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const userId = formData.get("userId") as string;
    const type = formData.get("type") as string;
    const amount = Number(formData.get("amount"));

    const optionalFields: Record<string, string> = {};
    (["description", "category"] as const).forEach((key) => {
      const value = formData.get(key);
      if (value && typeof value === "string") {
        optionalFields[key] = value;
      }
    });

    const transaction: Omit<Transaction, "id" | "createdAt"> = {
      userId,
      type: type as TransactionTypeEnum,
      amount,
      ...optionalFields,
    };

    const newTransaction = await createTransactionUseCase.execute(
      transaction,
      file && typeof file !== "string" ? file : undefined
    );

    const db = await dbRepository.read();
    return NextResponse.json({ transactions: db.transactions }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.error || "Erro ao criar transação",
        errorCode: error.errorCode || ErrorCodeEnum.REQUIRED_FIELDS,
      },
      { status: error.status || 400 }
    );
  }
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

