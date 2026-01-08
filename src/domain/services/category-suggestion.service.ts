import { categoryKeywords, TransactionCategoryEnum } from "../entities/transaction.entity";

export class CategorySuggestionService {
  suggestCategory(description: string): string | null {
    const normalized = description.toLowerCase();

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some((keyword) => normalized.includes(keyword))) {
        return category as TransactionCategoryEnum;
      }
    }

    return null;
  }
}

