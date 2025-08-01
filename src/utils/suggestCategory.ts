import { categoryKeywords, TransactionCategoryEnum } from "@/types/transactions";

export function suggestCategory(description: string): string | null {
  const normalized = description.toLowerCase();

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      return category as TransactionCategoryEnum;
    }
  }

  return null;
}
