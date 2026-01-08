import { ITransactionRepository } from "@/infrastructure/repositories/interfaces/transaction.repository.interface";
import { IStorageService } from "@/infrastructure/storage/interfaces/storage.service.interface";
import { ErrorCodeEnum } from "../../constants/errors";

export class DeleteTransactionUseCase {
  constructor(
    private transactionRepository: ITransactionRepository,
    private storageService: IStorageService
  ) {}

  async execute(id: number): Promise<void> {
    if (!id) {
      throw {
        error: "ID da transação é obrigatório.",
        errorCode: ErrorCodeEnum.REQUIRED_FIELDS,
        status: 400,
      };
    }

    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw {
        error: "Transação não encontrada.",
        errorCode: ErrorCodeEnum.TRANSACTION_NOT_FOUND,
        status: 404,
      };
    }

    if (transaction.fileUrl) {
      await this.storageService.deleteFile(id.toString());
    }

    await this.transactionRepository.delete(id);
  }
}

