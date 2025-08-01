 import { ErrorCodeEnum } from "@/types/apiErrors";
import { Transaction, TransactionTypeEnum } from "@/types/transactions";
import { readDb, writeDb } from "@/utils/db";
import getTotalBalance from "@/utils/getTotalBalance";
import { NextRequest, NextResponse } from "next/server";
// app/api/s3-upload/route.ts
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
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

// S3 Logic
export const runtime = "nodejs";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY!,
  },
});

const MAX_FILE_SIZE = 1 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "application/pdf"];

async function uploadFileToS3(buffer: Buffer, key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await s3Client.send(command);

  // Returns the S3 URL that will be inserted into the json
  const url = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com/${key}`;
  return url;
}

// -- POST logic
export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type");

  const result = await readDb();
  const totalBalance = getTotalBalance(result.transactions);
  const transactionId = Date.now();

  let userId: number = 0;
  let type: string = "";
  let amount: number = 0;
  let fileUrl = "";

  // Handle multipart form-data (with file)
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const userIdStr = formData.get("userId") as string;
  type = formData.get("type") as string;
  amount = Number(formData.get("amount"));
  userId = Number(userIdStr);

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
    fileUrl = await uploadFileToS3(buffer, transactionId.toString(), file.type);
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
  const newTransaction = {
    id: transactionId,
    createdAt: new Date().toISOString(),
    userId,
    type: type as TransactionTypeEnum,
    amount,
    fileUrl,
  };

  // Append the new transaction to the existing list and add date created and id
  const updatedTransactions = {
    ...result,
    transactions: [...result.transactions, newTransaction],
  };

  await writeDb(updatedTransactions);

  return NextResponse.json(
    { transactions: updatedTransactions.transactions },
    { status: 200 }
  );
}

export async function PUT(req: NextRequest) {
  const result = await readDb();
  const contentType = req.headers.get("content-type");

  // Handle multipart form-data (for file upload and edit logic)
  if (contentType?.includes("multipart/form-data")) {
    const formData = await req.formData();

    const id = Number(formData.get("id"));
    const type = formData.get("type") as string;
    const amount = Number(formData.get("amount"));
    const removeFile = formData.get("removeFile") === "true";
    const file = formData.get("file") as File | null;

    // Basic validations
    if (!id || !type || !amount) {
      return NextResponse.json(
        {
          error: "Campos obrigatórios.",
          errorCode: ErrorCodeEnum.REQUIRED_FIELDS,
        },
        { status: 400 }
      );
    }

    // Encontrar a transação existente
    const transactionIndex = result.transactions.findIndex(
      (transaction: Transaction) => transaction.id === id
    );

    if (transactionIndex === -1) {
      return NextResponse.json(
        {
          error: "Transação não encontrada.",
          errorCode: ErrorCodeEnum.TRANSACTION_NOT_FOUND,
        },
        { status: 400 }
      );
    }

    // Validações similares ao POST
    if (!Object.values(TransactionTypeEnum).includes(type as TransactionTypeEnum)) {
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
      (transaction: Transaction) => transaction.id !== id
    );
    const totalBalance = getTotalBalance(transactionsWithoutCurrent);

    if (
      type === TransactionTypeEnum.TRANSFER &&
      amount > totalBalance
    ) {
      return NextResponse.json(
        {
          error: "Saldo insuficiente.",
          errorCode: ErrorCodeEnum.INSUFICIENT_FUNDS_TYPE,
        },
        { status: 400 }
      );
    }

    const originalTransaction = result.transactions[transactionIndex];
    let fileUrl = originalTransaction.fileUrl;

    // Delete file from S3 if user clicked x button
    if (removeFile && fileUrl) {
      const command = new DeleteObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
        Key: `${id}`,
      });
      await s3Client.send(command);
      fileUrl = ""; // clear from JSON too
    }

    // Replace file if new one was uploaded
    if (file && typeof file !== "string") {
      const buffer = Buffer.from(await file.arrayBuffer());
      fileUrl = await uploadFileToS3(buffer, id.toString(), file.type);
    }

    // Atualizar a transação mantendo dados originais como createdAt
    result.transactions[transactionIndex] = {
      ...originalTransaction,
      type: type as TransactionTypeEnum,
      amount,
      fileUrl,
    };

    // Salvar arquivo atualizado
    await writeDb(result);

    return NextResponse.json(
      {
        message: "Transação atualizada com sucesso",
        transactions: result.transactions,
      },
      { status: 200 }
    );
  }

  // Fallback error
  return NextResponse.json(
    {
      error: "Formato de conteúdo inválido.",
      errorCode: ErrorCodeEnum.INVALID_UPLOAD_FORMAT,
    },
    { status: 400 }
  );
}

export async function DELETE(req: NextRequest) {
  const result = await readDb();

  // Extrair ID do formData (assumindo que será passado no corpo da requisição)
  const formData = await req.formData();
  const id = Number(formData.get("id"));

  if (!id) {
    return NextResponse.json(
      {
        error: "ID da transação é obrigatório.",
        errorCode: ErrorCodeEnum.REQUIRED_FIELDS,
      },
      { status: 400 }
    );
  }

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

  const deletedTransaction = result.transactions[transactionIndex];

  // Remover transação do array
  result.transactions.splice(transactionIndex, 1);

  // Apagar arquivo do S3 se existir
  if (deletedTransaction.fileUrl) {
    const s3Key = `${deletedTransaction.id}`;
    const command = new DeleteObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
      Key: s3Key,
    });

    await s3Client.send(command);
  }

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
