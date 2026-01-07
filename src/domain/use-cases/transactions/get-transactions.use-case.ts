import { Transaction } from "../../entities/transaction.entity";
import { ITransactionRepository } from "@/infrastructure/repositories/interfaces/transaction.repository.interface";
import { ErrorCodeEnum } from "../../constants/errors";

export class GetTransactionsUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(userId: string): Promise<Transaction[]> {
    if (!userId) {
      throw {
        error: "Parâmetro userId obrigatório",
        errorCode: ErrorCodeEnum.REQUIRED_FIELDS,
        status: 400,
      };
    }

    return await this.transactionRepository.findAll(userId);
  }
}

