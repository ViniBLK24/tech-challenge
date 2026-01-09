
import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Transactions API",
      version: "1.0.0",
      description: "API para gerenciar transações com upload de arquivos S3",
    },
    servers: [{ url: "http://localhost:3000" }], // local dev
    components: {
      schemas: {
        Transaction: {
          type: "object",
          properties: {
            id: { type: "integer", description: "Transaction ID" },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Data que a transação foi criada",
            },
            userId: { type: "string", description: "ID do usuário" },
            type: {
              type: "string",
              enum: ["DEPOSIT", "TRANSFER"],
              description: "Tipo de transação",
            },
            amount: { type: "number", description: "Valor da transação" },
            fileUrl: { type: "string", description: "URL do arquivo" },
            description: { type: "string", description: "Descrição da transação" },
            category: { type: "string", description: "Categoria da transação" },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Data que a transação foi editada",
            },
          },
          required: ["id", "createdAt", "userId", "type", "amount"],
        },
        ApiErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Descriptive error message',
              example: 'Transação não encontrada.',
            },
            errorCode: {
              type: 'string',
              description: 'Código do erro',
              enum: [
                'REQUIRED_FIELDS',
                'TRANSACTION_NOT_FOUND',
                'INVALID_TRANSFER_TYPE',
                'INSUFICIENT_FUNDS_TYPE',
                'INVALID_UPLOAD_FORMAT',
                'UPLOAD_FILE_TOO_BIG',
              ],
              example: 'TRANSACTION_NOT_FOUND',
            },
          },
          required: ['error', 'errorCode'],
        },
      },
    },
  },
  apis: ['./src/app/api/**/*.ts'], // path to API routes
};


export const swaggerSpec = swaggerJsdoc(swaggerOptions);