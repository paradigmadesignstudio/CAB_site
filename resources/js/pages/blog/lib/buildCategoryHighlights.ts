import type { BlogCategoryNavItem, BlogCategoryHighlight, BlogSearchItem } from "@/pages/blog/types";
import { searchItemToRecentCard } from "@/pages/blog/components/dense/blogDenseUtils";

const SKIP_CATEGORY_LINKS = new Set(["/blog", "/blog/eventos"]);

export type { BlogCategoryHighlight as CategoryHighlight };

function matchesCategory(item: BlogSearchItem, category: BlogCategoryNavItem): boolean {
  if (item.category === category.name) {
    return true;
  }

  return item.link.startsWith(`${category.link}/`);
}

export function buildCategoryHighlights(
  categories: BlogCategoryNavItem[],
  searchIndex: BlogSearchItem[],
  excludedIds: Set<number>,
  limit = 3,
  options?: { skipCategoryLinks?: Iterable<string> },
): BlogCategoryHighlight[] {
  const highlights: BlogCategoryHighlight[] = [];
  const skipLinks = new Set([...SKIP_CATEGORY_LINKS, ...(options?.skipCategoryLinks ?? [])]);

  for (const category of categories) {
    if (highlights.length >= limit || skipLinks.has(category.link)) {
      continue;
    }

    const match = searchIndex.find(
      (item) => !excludedIds.has(item.id) && matchesCategory(item, category),
    );

    if (!match) {
      continue;
    }

    highlights.push({
      category,
      post: searchItemToRecentCard(match),
    });
  }

  return highlights;
}
