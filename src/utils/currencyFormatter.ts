/**
 * Format value to currency. Adds decimals and thousand separators
 * @example
 * // Returns "12.345,67"
 * currencyFormatter("1234567")
 */
export function currencyFormatter(value: string): string {
  const nonDigitsRegex = /\D/g;

  const sanitizedValue = value.replace(nonDigitsRegex, "");
  if (sanitizedValue.length <= 1) {
    return "0,0" + sanitizedValue;
  }
  const withDecimals = [
    sanitizedValue.slice(0, sanitizedValue.length - 2),
    ".",
    sanitizedValue.slice(sanitizedValue.length - 2),
  ].join("");
  return new Intl.NumberFormat("pt-br", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(
    // @ts-expect-error String only be numbers
    withDecimals
  );
}
