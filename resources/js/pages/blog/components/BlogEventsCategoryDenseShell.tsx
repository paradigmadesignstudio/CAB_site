import { useCallback, useMemo, useState } from "react";
import { CalendarDays, History } from "lucide-react";
import { AgendaInvertedBottomCard } from "@/pages/components/agenda/AgendaInvertedBottomCard";
import { BlogCategoryHighlightsSection } from "@/pages/blog/components/BlogCategoryHighlightsSection";
import { BlogContextualNewsletter } from "@/pages/blog/components/BlogContextualNewsletter";
import { BlogEcosystemBand } from "@/pages/blog/components/BlogEcosystemBand";
import { BlogSearchResults } from "@/pages/blog/components/BlogSearchResults";
import { buildEventsSections } from "@/pages/blog/cab-events/lib/buildEventsSections";
import { BlogDenseFeaturedMosaic } from "@/pages/blog/components/dense/BlogDenseSections";
import { BlogDenseStickyHeader } from "@/pages/blog/components/dense/BlogDenseStickyHeader";
import { useBlogSearchIndex } from "@/pages/blog/hooks/useBlogSearchIndex";
import { filterBlogSearchItems } from "@/pages/blog/lib/search";
import type {
  BlogCategoryPageData,
  BlogCategorySidecarData,
  BlogFeaturedCard,
} from "@/pages/blog/types";

interface BlogEventsCategoryDenseShellProps {
  categoryData: BlogCategoryPageData;
  categoryRoute: string;
  categorySidecar?: BlogCategorySidecarData;
}

export function BlogEventsCategoryDenseShell({
  categoryData,
  categoryRoute,
  categorySidecar,
}: BlogEventsCategoryDenseShellProps) {
  const categoryHighlights = categorySidecar?.categoryHighlights ?? [];
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

  const { agendaEvents, pastEvents } = useMemo(
    () => buildEventsSections(categoryData),
    [categoryData],
  );

  return (
    <div className="pb-12 pt-[6.25rem] sm:pt-[7.25rem]">
      <BlogDenseStickyHeader
        eyebrow="Portal CAB · Blog"
        title={categoryData.name}
        description={categoryData.description}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchFocus={() => void ensureLoaded()}
        searchPlaceholder="Buscar em Eventos..."
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

          <section className="border-b border-[#003B7A]/8 bg-gradient-to-b from-white to-[#003B7A]/[0.03] py-8 sm:py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="mb-1 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.26em] text-[#009739]">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Próximos encontros
                  </p>
                  <h2 className="text-xl font-black text-[#003B7A] sm:text-2xl">Agenda CAB</h2>
                  <p className="mt-1 max-w-xl text-sm text-[#003B7A]/60">
                    Congressos, workshops e encontros técnicos da comunidade CAB.
                  </p>
                </div>
              </div>

              {agendaEvents.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {agendaEvents.map((event) => (
                    <AgendaInvertedBottomCard key={event.id} event={event} className="h-full" />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-[#003B7A]/15 bg-white/80 px-6 py-10 text-center">
                  <p className="text-sm font-bold text-[#003B7A]">Nenhum evento na agenda no momento</p>
                  <p className="mt-1 text-sm text-[#003B7A]/55">Volte em breve para conferir novos encontros.</p>
                </div>
              )}
            </div>
          </section>

          <section className="border-b border-[#003B7A]/8 py-10 sm:py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="mb-6">
                <p className="mb-1 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.26em] text-[#003B7A]/50">
                  <History className="h-3.5 w-3.5" />
                  Arquivo
                </p>
                <h2 className="text-xl font-black text-[#003B7A] sm:text-2xl">Eventos realizados</h2>
                {pastEvents.length > 0 && (
                  <p className="mt-1 text-sm text-[#003B7A]/60">
                    {pastEvents.length} {pastEvents.length === 1 ? "evento" : "eventos"} no arquivo
                  </p>
                )}
              </div>

              {pastEvents.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {pastEvents.map((event) => (
                    <AgendaInvertedBottomCard key={event.id} event={event} className="h-full" />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-[#003B7A]/15 bg-white/80 px-6 py-10 text-center">
                  <p className="text-sm font-bold text-[#003B7A]">Nenhum evento realizado ainda</p>
                  <p className="mt-1 text-sm text-[#003B7A]/55">Os eventos encerrados aparecerão aqui.</p>
                </div>
              )}
            </div>
          </section>

          <BlogCategoryHighlightsSection highlights={categoryHighlights} />

          <BlogContextualNewsletter context="eventos" categoryName={categoryData.name} />

          <BlogEcosystemBand context="eventos" />
        </>
      )}
    </div>
  );
}
