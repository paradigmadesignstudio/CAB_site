import type { BlogCategoryGridPost, BlogRecentCard, BlogSearchItem } from "@/pages/blog/types";

export const FEED_PREVIEW_SIZE = 6;
export const TRENDING_SECTION_SIZE = 4;

export const EMPTY_FEED_POSTS: BlogRecentCard[] = [];

export function searchItemToRecentCard(item: BlogSearchItem): BlogRecentCard {
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    date: item.date,
    readTime: item.readTime ?? "5 min",
    author: item.author,
    authorInitials: item.authorInitials,
    link: item.link,
    image: item.image,
  };
}

export function gridPostToRecentCard(post: BlogCategoryGridPost, categoryName: string): BlogRecentCard {
  return {
    id: post.id,
    title: post.title,
    category: categoryName,
    date: post.date,
    readTime: post.readTime,
    author: post.author,
    authorInitials: post.authorInitials,
    link: post.link,
    image: post.image,
  };
}

export function normalizeFeedPost(
  post: BlogRecentCard | BlogCategoryGridPost,
  categoryName: string,
): BlogRecentCard {
  if ("category" in post && post.category) {
    return post as BlogRecentCard;
  }

  return gridPostToRecentCard(post as BlogCategoryGridPost, categoryName);
}

export function buildFeedPreviewPosts(
  searchIndex: BlogSearchItem[],
  excludedIds: Set<number>,
  limit = FEED_PREVIEW_SIZE,
): BlogRecentCard[] {
  const posts: BlogRecentCard[] = [];

  for (const item of searchIndex) {
    if (posts.length >= limit) {
      break;
    }
    if (excludedIds.has(item.id)) {
      continue;
    }
    posts.push(searchItemToRecentCard(item));
  }

  return posts;
}

export function buildTrendingPosts(
  searchIndex: BlogSearchItem[],
  excludedIds: Set<number>,
  limit = TRENDING_SECTION_SIZE,
): BlogRecentCard[] {
  const posts: BlogRecentCard[] = [];

  for (const item of searchIndex) {
    if (posts.length >= limit) {
      break;
    }
    if (excludedIds.has(item.id)) {
      continue;
    }
    posts.push(searchItemToRecentCard(item));
  }

  return posts;
}

export function collectPostIds(posts: Array<{ id: number }>): Set<number> {
  return new Set(posts.map((post) => post.id));
}
