import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchBlogPosts } from "@/pages/blog/services/loadMore";
import type { BlogPagination } from "@/pages/blog/types";

interface UseBlogPaginationOptions<T extends { id: number }> {
  initialPosts: T[];
  pagination?: BlogPagination | null;
  context: "index" | "category";
  categorySlug?: string;
}

export function useBlogPagination<T extends { id: number }>({
  initialPosts,
  pagination,
  context,
  categorySlug,
}: UseBlogPaginationOptions<T>) {
  const [posts, setPosts] = useState<T[]>(initialPosts);
  const [page, setPage] = useState(pagination?.page ?? 1);
  const [hasMore, setHasMore] = useState(pagination?.hasMore ?? false);
  const [loading, setLoading] = useState(false);

  const initialPostsKey = useMemo(
    () => initialPosts.map((post) => post.id).join(","),
    [initialPosts],
  );

  useEffect(() => {
    setPosts(initialPosts);
    setPage(pagination?.page ?? 1);
    setHasMore(pagination?.hasMore ?? false);
  }, [initialPosts, initialPostsKey, pagination?.hasMore, pagination?.page]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !pagination) {
      return;
    }

    setLoading(true);

    try {
      const nextPage = posts.length === 0 ? 1 : page + 1;
      const response = await fetchBlogPosts({
        context,
        page: nextPage,
        category: categorySlug,
      });

      setPosts((current) => {
        const seen = new Set(current.map((post) => post.id));
        const nextPosts = (response.posts as unknown as T[]).filter((post) => !seen.has(post.id));

        return [...current, ...nextPosts];
      });
      setPage(response.pagination.page);
      setHasMore(response.pagination.hasMore);
    } finally {
      setLoading(false);
    }
  }, [categorySlug, context, hasMore, loading, page, pagination, posts.length]);

  return { posts, hasMore, loading, loadMore };
}
