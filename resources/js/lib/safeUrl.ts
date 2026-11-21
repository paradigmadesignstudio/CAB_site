/**
 * Retorna a URL apenas se o protocolo for http ou https; caso contrário, string vazia.
 */
export function safeHttpUrl(url: string | undefined | null): string {
  const trimmed = (url ?? "").trim();

  if (!trimmed) {
    return "";
  }

  try {
    const parsed = new URL(trimmed);

    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return trimmed;
    }
  } catch {
    return "";
  }

  return "";
}
