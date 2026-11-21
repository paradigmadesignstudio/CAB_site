import type { BlogSearchItem } from "@/pages/blog/types";

export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function filterBlogSearchItems(
  items: BlogSearchItem[],
  query: string,
): BlogSearchItem[] {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return items;
  }

  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  return items.filter((item) => {
    const haystack = normalizeSearchText(
      [item.title, item.excerpt, item.category, item.author].filter(Boolean).join(" "),
    );

    return terms.every((term) => haystack.includes(term));
  });
}
