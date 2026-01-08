import { Transaction, TransactionTypeEnum } from "../../entities/transaction.entity";
import { ITransactionRepository } from "@/infrastructure/repositories/interfaces/transaction.repository.interface";
import { IStorageService } from "@/infrastructure/storage/interfaces/storage.service.interface";
import { CalculateBalanceUseCase } from "./calculate-balance.use-case";
import { ErrorCodeEnum } from "../../constants/errors";
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from "../../constants/file-validation.constants";

export class UpdateTransactionUseCase {
  constructor(
    private transactionRepository: ITransactionRepository,
    private storageService: IStorageService,
    private calculateBalanceUseCase: CalculateBalanceUseCase
  ) {}

  async execute(
    id: number,
    transaction: Partial<Transaction>,
    removeFile: boolean,
    file?: File
  ): Promise<Transaction> {
    if (!id || !transaction.type || !transaction.amount) {
      throw {
        error: "Campos obrigatórios.",
        errorCode: ErrorCodeEnum.REQUIRED_FIELDS,
        status: 400,
      };
    }

    const existingTransaction = await this.transactionRepository.findById(id);
    if (!existingTransaction) {
      throw {
        error: "Transação não encontrada.",
        errorCode: ErrorCodeEnum.TRANSACTION_NOT_FOUND,
        status: 400,
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
    const transactionsWithoutCurrent = allTransactions.filter((t) => t.id !== id);
    const totalBalance = this.calculateBalanceUseCase.execute(transactionsWithoutCurrent);

    if (transaction.type === TransactionTypeEnum.TRANSFER && transaction.amount! > totalBalance) {
      throw {
        error: "Saldo insuficiente.",
        errorCode: ErrorCodeEnum.INSUFICIENT_FUNDS_TYPE,
        status: 400,
      };
    }

    let fileUrl = existingTransaction.fileUrl || "";

    if (removeFile && fileUrl) {
      await this.storageService.deleteFile(id.toString());
      fileUrl = "";
    }

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

      const buffer = Buffer.from(await file.arrayBuffer());
      fileUrl = await this.storageService.uploadFile(buffer, id.toString(), file.type);
    }

    return await this.transactionRepository.update(id, {
      ...transaction,
      fileUrl,
    });
  }
}

