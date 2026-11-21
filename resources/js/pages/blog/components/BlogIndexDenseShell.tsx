import { useCallback, useMemo, useState } from "react";
import { BlogCategoryHighlightsSection } from "@/pages/blog/components/BlogCategoryHighlightsSection";
import { BlogContextualNewsletter } from "@/pages/blog/components/BlogContextualNewsletter";
import { BlogEcosystemBand } from "@/pages/blog/components/BlogEcosystemBand";
import { BlogEventsPreviewSection } from "@/pages/blog/components/BlogEventsPreviewSection";
import { BlogSearchResults } from "@/pages/blog/components/BlogSearchResults";
import { BlogTrendingSection } from "@/pages/blog/components/BlogTrendingSection";
import {
  BlogIndexFeaturedMosaic,
  BlogIndexSecondaryMosaicCard,
  BlogIndexSidebarColumnists,
  BlogIndexSidebarLatest,
  indexSecondaryGridClassName,
} from "@/pages/blog/components/dense/BlogIndexDenseMosaic";
import { BlogDenseFeedSection } from "@/pages/blog/components/dense/BlogDenseSections";
import { BlogDenseStickyHeader } from "@/pages/blog/components/dense/BlogDenseStickyHeader";
import { collectPostIds, EMPTY_FEED_POSTS } from "@/pages/blog/components/dense/blogDenseUtils";
import { useBlogPagination } from "@/pages/blog/hooks/useBlogPagination";
import { useBlogSearchIndex } from "@/pages/blog/hooks/useBlogSearchIndex";
import { filterBlogSearchItems } from "@/pages/blog/lib/search";
import { useSiteFeatures } from "@/hooks/useSiteFeatures";
import type {
  BlogIndexPageContent,
  BlogIndexShellData,
} from "@/pages/blog/types";

interface BlogIndexDenseShellProps {
  pageContent: BlogIndexPageContent;
  indexShell?: BlogIndexShellData;
}

function mosaicPostIds(pageContent: BlogIndexPageContent): Set<number> {
  return new Set<number>([
    ...(pageContent.featuredPost ? [pageContent.featuredPost.id] : []),
    ...pageContent.subFeaturedPosts.slice(0, 3).map((post) => post.id),
  ]);
}

export function BlogIndexDenseShell({
  pageContent,
  indexShell,
}: BlogIndexDenseShellProps) {
  const trendingPosts = indexShell?.trendingPosts ?? [];
  const feedPreviewPosts = indexShell?.feedPreviewPosts ?? EMPTY_FEED_POSTS;
  const categoryHighlights = indexShell?.categoryHighlights ?? [];
  const { blogColumnists } = useSiteFeatures();
  const [searchQuery, setSearchQuery] = useState("");
  const { searchIndex, ensureLoaded, loading: searchLoading } = useBlogSearchIndex({ context: "index" });

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

  const sidebarLatest = pageContent.recentPosts.slice(0, 5);
  const subFeatured = pageContent.subFeaturedPosts.slice(0, 3);
  const hasMosaic = Boolean(pageContent.featuredPost) || subFeatured.length > 0;

  const mosaicIds = useMemo(() => mosaicPostIds(pageContent), [pageContent]);

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
    pagination: pageContent.recentPagination,
    context: "index",
  });

  const feedPosts = useMemo(() => {
    const seen = new Set<number>();

    return visiblePosts.filter((post) => {
      if (highlightedPostIds.has(post.id) || seen.has(post.id)) {
        return false;
      }
      seen.add(post.id);
      return true;
    });
  }, [visiblePosts, highlightedPostIds]);

  const indexTitle = pageContent.meta.title.replace(" | Portal CAB", "");

  return (
    <div className="pb-12 pt-[6.25rem] sm:pt-[7.25rem]">
      <BlogDenseStickyHeader
        eyebrow="Portal CAB · Blog"
        title={indexTitle}
        description={pageContent.meta.description}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchFocus={() => void ensureLoaded()}
        searchPlaceholder="Buscar no blog..."
        categories={pageContent.categories}
        activeCategoryName={pageContent.defaultCategory}
        stickyToolbarOnly
      />

      {isSearching ? (
        <div className="mx-auto max-w-7xl scroll-mt-[13rem] px-4 py-10 sm:scroll-mt-[14rem] sm:px-6">
          {searchLoading && filteredResults.length === 0 ? (
            <p className="text-sm text-[#003B7A]/60">Carregando resultados...</p>
          ) : (
            <BlogSearchResults results={filteredResults} query={searchQuery.trim()} layout="list" />
          )}
        </div>
      ) : (
        <>
          {hasMosaic && (
            <section className="mx-auto max-w-7xl scroll-mt-[13rem] px-4 pb-8 pt-6 sm:scroll-mt-[14rem] sm:px-6 sm:pt-8">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
                <div className="space-y-4 lg:col-span-8">
                  {pageContent.featuredPost && (
                    <div className="pt-1">
                      <BlogIndexFeaturedMosaic post={pageContent.featuredPost} />
                    </div>
                  )}
                  {subFeatured.length > 0 && (
                    <div className={indexSecondaryGridClassName}>
                      {subFeatured.map((post) => (
                        <BlogIndexSecondaryMosaicCard key={post.id} post={post} />
                      ))}
                    </div>
                  )}
                </div>

                <aside className="space-y-4 lg:col-span-4 lg:sticky lg:top-[15.5rem] lg:max-h-[calc(100dvh-16rem)] lg:overflow-y-auto xl:top-[16.5rem]">
                  <BlogIndexSidebarLatest posts={sidebarLatest} />
                  {blogColumnists && (
                    <BlogIndexSidebarColumnists columnists={pageContent.columnists} />
                  )}
                </aside>
              </div>
            </section>
          )}

          <BlogTrendingSection posts={trendingPosts} />

          <BlogEventsPreviewSection upcomingEvents={pageContent.upcomingEvents ?? []} />

          <BlogCategoryHighlightsSection highlights={categoryHighlights} />

          <BlogContextualNewsletter context="portal" />

          <BlogEcosystemBand context="portal" />

          <BlogDenseFeedSection
            posts={feedPosts}
            eyebrow="Arquivo"
            title="Todas as publicações"
            totalCount={pageContent.recentPagination?.total ?? feedPosts.length}
            hasMore={hasMore}
            loading={loading}
            onLoadMore={loadMore}
            revealLabel="Ver publicações do arquivo"
            loadMoreLabel="Carregar mais publicações"
          />
        </>
      )}
    </div>
  );
}
