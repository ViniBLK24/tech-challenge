export function sanitizeText(text: string | null | undefined): string {
  if (!text) {
    return "";
  }

  return String(text)
    .replace(/[\x00-\x1F\x7F-\x9F]/g, "")
    .replace(/[<>]/g, "")
    .trim()
    .substring(0, 100);
}

export function sanitizeHtml(text: string | null | undefined): string {
  if (typeof window === 'undefined') {
    return sanitizeText(text);
  }

  if (!text) {
    return "";
  }

  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}
