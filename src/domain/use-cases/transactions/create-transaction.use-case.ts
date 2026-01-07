import { Transaction, TransactionTypeEnum } from "../../entities/transaction.entity";
import { ITransactionRepository } from "@/infrastructure/repositories/interfaces/transaction.repository.interface";
import { IStorageService } from "@/infrastructure/storage/interfaces/storage.service.interface";
import { CalculateBalanceUseCase } from "./calculate-balance.use-case";
import { ErrorCodeEnum } from "../../constants/errors";
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from "../../constants/file-validation.constants";

export class CreateTransactionUseCase {
  constructor(
    private transactionRepository: ITransactionRepository,
    private storageService: IStorageService,
    private calculateBalanceUseCase: CalculateBalanceUseCase
  ) {}

  async execute(
    transaction: Omit<Transaction, "id" | "createdAt">,
    file?: File
  ): Promise<Transaction> {
    if (!transaction.userId || !transaction.type || !transaction.amount) {
      throw {
        error: "Preencha todos os campos.",
        errorCode: ErrorCodeEnum.REQUIRED_FIELDS,
        status: 402,
      };
    }

    if (!Object.values(TransactionTypeEnum).includes(transaction.type)) {
      throw {
        error: "Tipo de transferência inválido.",
        errorCode: ErrorCodeEnum.INVALID_TRANSFER_TYPE,
        status: 400,
      };
    }

    const allTransactions = await this.transactionRepository.findAll();
    const totalBalance = this.calculateBalanceUseCase.execute(allTransactions);

    if (transaction.type === TransactionTypeEnum.TRANSFER && transaction.amount > totalBalance) {
      throw {
        error: "Saldo insuficiente.",
        errorCode: ErrorCodeEnum.INSUFICIENT_FUNDS_TYPE,
        status: 400,
      };
    }

    let fileUrl = "";

    if (file) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        throw {
          error: "Tipo de arquivo inválido.",
          errorCode: ErrorCodeEnum.INVALID_UPLOAD_FORMAT,
          status: 400,
        };
      }
      if (file.size > MAX_FILE_SIZE) {
        throw {
          error: "Arquivo muito grande (limite 1MB).",
          errorCode: ErrorCodeEnum.UPLOAD_FILE_TOO_BIG,
          status: 400,
        };
      }

      const transactionId = Date.now();
      const buffer = Buffer.from(await file.arrayBuffer());
      fileUrl = await this.storageService.uploadFile(buffer, transactionId.toString(), file.type);
    }

    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      fileUrl,
    };

    return await this.transactionRepository.create(newTransaction);
  }
}

