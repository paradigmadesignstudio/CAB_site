const MONTH_INDEX: Record<string, number> = {
  janeiro: 0,
  fevereiro: 1,
  março: 2,
  marco: 2,
  abril: 3,
  maio: 4,
  junho: 5,
  julho: 6,
  agosto: 7,
  setembro: 8,
  outubro: 9,
  novembro: 10,
  dezembro: 11,
};

export const POST_NEW_DAYS = 7;

export function parseBrazilianPostDate(date: string): Date | null {
  const match = date.match(/(\d{1,2})\s+de\s+([\p{L}]+),?\s+(\d{4})/iu);
  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const monthKey = match[2]
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const year = Number(match[3]);
  const month = MONTH_INDEX[monthKey];

  if (Number.isNaN(day) || Number.isNaN(year) || month === undefined) {
    return null;
  }

  return new Date(year, month, day);
}

export function isPostNew(date: string, maxDays = POST_NEW_DAYS): boolean {
  const published = parseBrazilianPostDate(date);
  if (!published) {
    return false;
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfPublished = new Date(published.getFullYear(), published.getMonth(), published.getDate());
  const diffMs = startOfToday.getTime() - startOfPublished.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays >= 0 && diffDays <= maxDays;
}
