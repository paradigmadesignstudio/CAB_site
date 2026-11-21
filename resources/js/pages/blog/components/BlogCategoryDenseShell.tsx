import { useCallback, useMemo, useState } from "react";
import { BlogCategoryHighlightsSection } from "@/pages/blog/components/BlogCategoryHighlightsSection";
import { BlogContextualNewsletter } from "@/pages/blog/components/BlogContextualNewsletter";
import { BlogEcosystemBand } from "@/pages/blog/components/BlogEcosystemBand";
import { BlogEventsPreviewSection } from "@/pages/blog/components/BlogEventsPreviewSection";
import { BlogSearchResults } from "@/pages/blog/components/BlogSearchResults";
import { BlogTrendingSection } from "@/pages/blog/components/BlogTrendingSection";
import {
  BlogDenseFeaturedMosaic,
  BlogDenseFeedSection,
} from "@/pages/blog/components/dense/BlogDenseSections";
import { BlogDenseStickyHeader } from "@/pages/blog/components/dense/BlogDenseStickyHeader";
import { collectPostIds, EMPTY_FEED_POSTS, normalizeFeedPost } from "@/pages/blog/components/dense/blogDenseUtils";
import { useBlogPagination } from "@/pages/blog/hooks/useBlogPagination";
import { useBlogSearchIndex } from "@/pages/blog/hooks/useBlogSearchIndex";
import { resolveEditorialContext } from "@/pages/blog/lib/blogEditorialContext";
import { filterBlogSearchItems } from "@/pages/blog/lib/search";
import type {
  BlogCategoryGridPost,
  BlogCategoryPageData,
  BlogCategorySidecarData,
  BlogFeaturedCard,
  BlogRecentCard,
} from "@/pages/blog/types";

interface BlogCategoryDenseShellProps {
  categoryData: BlogCategoryPageData;
  categoryRoute: string;
  categorySidecar?: BlogCategorySidecarData;
}

export function BlogCategoryDenseShell({
  categoryData,
  categoryRoute,
  categorySidecar,
}: BlogCategoryDenseShellProps) {
  const trendingPosts = categorySidecar?.trendingPosts ?? [];
  const feedPreviewPosts = categorySidecar?.feedPreviewPosts ?? EMPTY_FEED_POSTS;
  const categoryHighlights = categorySidecar?.categoryHighlights ?? [];
  const upcomingEvents = categorySidecar?.upcomingEvents ?? [];
  const [searchQuery, setSearchQuery] = useState("");
  const { searchIndex, ensureLoaded, loading: searchLoading } = useBlogSearchIndex({
    context: "category",
    categoryRoute,
  });

  const handleSearchChange = useCallback(
    (value: string) => {
      const nextValue = value ?? "";
      if (nextValue.trim().length > 0) {
        void ensureLoaded();
      }
      setSearchQuery(nextValue);
    },
    [ensureLoaded],
  );

  const filteredResults = useMemo(
    () => filterBlogSearchItems(searchIndex, searchQuery),
    [searchIndex, searchQuery],
  );
  const isSearching = searchQuery.trim().length > 0;
  const editorialContext = resolveEditorialContext(categoryData.name);

  const mosaicIds = useMemo(
    () => new Set(categoryData.featuredPost ? [categoryData.featuredPost.id] : []),
    [categoryData.featuredPost],
  );

  const highlightedPostIds = useMemo(
    () => new Set([...mosaicIds, ...collectPostIds(trendingPosts)]),
    [mosaicIds, trendingPosts],
  );

  const {
    posts: visiblePosts,
    hasMore,
    loading,
    loadMore,
  } = useBlogPagination({
    initialPosts: feedPreviewPosts,
    pagination: categoryData.postsPagination,
    context: "category",
    categorySlug: categoryData.postsPagination?.categorySlug,
  });

  const feedPosts = useMemo(() => {
    const seen = new Set<number>();

    return visiblePosts
      .map((post) => normalizeFeedPost(post, categoryData.name))
      .filter((post) => {
        if (highlightedPostIds.has(post.id) || seen.has(post.id)) {
          return false;
        }
        seen.add(post.id);
        return true;
      });
  }, [categoryData.name, highlightedPostIds, visiblePosts]);

  return (
    <div className="pb-12 pt-[6.25rem] sm:pt-[7.25rem]">
      <BlogDenseStickyHeader
        eyebrow="Portal CAB · Blog"
        title={categoryData.name}
        description={categoryData.description}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchFocus={() => void ensureLoaded()}
        searchPlaceholder={`Buscar em ${categoryData.name}...`}
        categories={categoryData.allCategoriesList}
        activeCategoryName={categoryData.name}
        stickyToolbarOnly
      />

      {isSearching ? (
        <div className="mx-auto max-w-7xl scroll-mt-[13rem] px-4 py-10 sm:scroll-mt-[14rem] sm:px-6">
          {searchLoading && filteredResults.length === 0 ? (
            <p className="text-sm text-[#003B7A]/60">Carregando resultados...</p>
          ) : (
            <BlogSearchResults
              results={filteredResults}
              query={searchQuery.trim()}
              layout="list"
              categoryName={categoryData.name}
            />
          )}
        </div>
      ) : (
        <>
          {categoryData.featuredPost && (
            <section className="mx-auto max-w-7xl scroll-mt-[13rem] px-4 pb-8 pt-6 sm:scroll-mt-[14rem] sm:px-6 sm:pt-8">
              <BlogDenseFeaturedMosaic post={categoryData.featuredPost as BlogFeaturedCard} />
            </section>
          )}

          {!categoryData.featuredPost && (
            <div className="h-4 sm:h-6" aria-hidden />
          )}

          <BlogTrendingSection posts={trendingPosts} />

          <BlogEventsPreviewSection upcomingEvents={upcomingEvents} />

          <BlogCategoryHighlightsSection highlights={categoryHighlights} />

          <BlogContextualNewsletter context={editorialContext} categoryName={categoryData.name} />

          <BlogEcosystemBand context={editorialContext} />

          <BlogDenseFeedSection
            posts={feedPosts}
            eyebrow="Arquivo"
            title={`Todas em ${categoryData.name}`}
            totalCount={categoryData.postsPagination?.total ?? feedPosts.length}
            hasMore={hasMore}
            loading={loading}
            onLoadMore={loadMore}
            revealLabel={`Ver publicações de ${categoryData.name}`}
            loadMoreLabel={`Carregar mais de ${categoryData.name}`}
          />
        </>
      )}
    </div>
  );
}
