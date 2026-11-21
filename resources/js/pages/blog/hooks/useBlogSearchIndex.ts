import { useCallback, useState } from "react";
import axios from "axios";
import type { BlogSearchItem } from "@/pages/blog/types";

interface UseBlogSearchIndexOptions {
  context: "index" | "category";
  categoryRoute?: string;
}

export function useBlogSearchIndex({ context, categoryRoute }: UseBlogSearchIndexOptions) {
  const [searchIndex, setSearchIndex] = useState<BlogSearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const ensureLoaded = useCallback(async () => {
    if (loaded || loading) {
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.get<{ items: BlogSearchItem[] }>("/blog/search-index", {
        params: {
          context,
          ...(context === "category" ? { category: categoryRoute } : {}),
        },
      });

      setSearchIndex(data.items);
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  }, [categoryRoute, context, loaded, loading]);

  return { searchIndex, ensureLoaded, loading, loaded };
}
