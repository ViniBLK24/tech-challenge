import { ErrorCodeEnum } from "@/types/apiErrors";
import { Transaction, TransactionTypeEnum } from "@/types/transactions";
import { readDb, writeDb } from "@/utils/db";
import getTotalBalance from "@/utils/getTotalBalance";
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) {
    return authError;
  }

  const userId = String(req.nextUrl.searchParams.get("userId"));

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
  const authError = requireAuth(req);
  if (authError) {
    return authError;
  }

  const result = await readDb();
  const totalBalance = getTotalBalance(result.transactions);
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

  await writeDb(updatedTransactions);

  return NextResponse.json(
    { transactions: updatedTransactions.transactions },
    { status: 200 }
  );
}

export async function PUT(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) {
    return authError;
  }

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

    const optionalFields: Record<string, string> = {};
    (["description", "category"] as const).forEach((key) => {
      const value = formData.get(key);
      // Checks if fields exists
      if (value && typeof value === "string") {
        optionalFields[key] = value;
      }
    });


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
      ...optionalFields,
      // Remove updatedAt if Transaction type does not allow it
      updatedAt: new Date().toISOString(),
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
  const authError = requireAuth(req);
  if (authError) {
    return authError;
  }

  const result = await readDb();
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

/**
 * @openapi
 * components:
 *   schemas:
 *     ApiErrorResponse:
 *       type: object
 *       required:
 *         - error
 *         - errorCode
 *       properties:
 *         error:
 *           type: string
 *           description: Mensagem descritiva do erro
 *         errorCode:
 *           type: string
 *           description: Código do erro
 *           enum:
 *             - REQUIRED_FIELDS
 *             - TRANSACTION_NOT_FOUND
 *             - INVALID_TRANSFER_TYPE
 *             - INSUFICIENT_FUNDS_TYPE
 *             - INVALID_UPLOAD_FORMAT
 *             - UPLOAD_FILE_TOO_BIG
 *     Transaction:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         userId:
 *           type: integer
 *         type:
 *           type: string
 *           enum: [DEPOSIT, TRANSFER]
 *         amount:
 *           type: number
 *         fileUrl:
 *           type: string
 *           format: uri
 *         description:
 *           type: string
 *         category:
 *           type: string
 */

/**
 * @openapi
 * /api/transactions:
 *   get:
 *     summary: Lista todas as transações do usuário
 *     parameters:
 *       - name: userId
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário para filtrar transações
 *     responses:
 *       200:
 *         description: Lista de transações
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 */
 
 /**
 * @openapi
 * /api/transactions:
 *  post:
 *     summary: Cria uma nova transação
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: 
 *               - userId
 *               - type
 *               - amount
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID do usuário
 *               type:
 *                 type: string
 *                 enum: [DEPOSIT, TRANSFER]
 *               amount:
 *                 type: number
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo opcional (imagem ou PDF)
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transação criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Requisição inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *             examples:
 *               MissingUserId:
 *                 summary: ID do usuário não enviado
 *                 value:
 *                   error: "Parâmetro userId obrigatório"
 *                   errorCode: "REQUIRED_FIELDS"
 *               InvalidTransferType:
 *                 summary: Tipo de transação inválido
 *                 value:
 *                   error: "Tipo de transferência inválido."
 *                   errorCode: "INVALID_TRANSFER_TYPE"
 *               InsufficientFunds:
 *                 summary: Saldo insuficiente para transferência
 *                 value:
 *                   error: "Saldo insuficiente."
 *                   errorCode: "INSUFICIENT_FUNDS_TYPE"
 *               InvalidFile:
 *                 summary: Tipo de arquivo inválido
 *                 value:
 *                   error: "Tipo de arquivo inválido."
 *                   errorCode: "INVALID_UPLOAD_FORMAT"
 *       402:
 *         description: Campos obrigatórios não preenchidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
 
 /**
 * @openapi
 * /api/transactions:
 *   put:
 *     summary: Atualiza uma transação existente
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - type
 *               - amount
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID da transação
 *               type:
 *                 type: string
 *                 enum: [DEPOSIT, TRANSFER]
 *               amount:
 *                 type: number
 *               removeFile:
 *                 type: string
 *                 enum: ["true", "false"]
 *                 description: Remove o arquivo existente do S3
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Novo arquivo opcional
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transação atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Erro de validação ou atualização
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *             examples:
 *               MissingFields:
 *                 summary: Campos obrigatórios ausentes
 *                 value:
 *                   error: "Campos obrigatórios."
 *                   errorCode: "REQUIRED_FIELDS"
 *               InvalidType:
 *                 summary: Tipo de transferência inválido
 *                 value:
 *                   error: "Tipo de transferência inválido."
 *                   errorCode: "INVALID_TRANSFER_TYPE"
 *               TransactionNotFound:
 *                 summary: Transação não encontrada
 *                 value:
 *                   error: "Transação não encontrada."
 *                   errorCode: "TRANSACTION_NOT_FOUND"
 *               InsufficientFunds:
 *                 summary: Saldo insuficiente
 *                 value:
 *                   error: "Saldo insuficiente."
 *                   errorCode: "INSUFICIENT_FUNDS_TYPE"
 */
 
 /**
 * @openapi
 * /api/transactions:
 *   delete:
 *     summary: Remove uma transação existente
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID da transação a ser removida
 *     responses:
 *       200:
 *         description: Transação removida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *             examples:
 *               MissingId:
 *                 summary: ID da transação é obrigatório
 *                 value:
 *                   error: "ID da transação é obrigatório."
 *                   errorCode: "REQUIRED_FIELDS"
 *       404:
 *         description: Transação não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *             examples:
 *               NotFound:
 *                 summary: Transação não encontrada
 *                 value:
 *                   error: "Transação não encontrada."
 *                   errorCode: "TRANSACTION_NOT_FOUND"
 */