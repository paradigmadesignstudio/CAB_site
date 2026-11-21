import { Link } from "@inertiajs/react";
import { Search } from "lucide-react";
import { INERTIA_PREFETCH_HOVER } from "@/lib/inertiaPrefetch";
import type { BlogCategoryNavItem } from "@/pages/blog/types";

/** Offset alinhado à navbar fixa do site. */
export const BLOG_DENSE_NAV_OFFSET_CLASS = "top-[5.5rem] sm:top-[6.5rem] xl:top-[7.25rem]";

interface BlogDenseStickyHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchFocus?: () => void;
  searchPlaceholder?: string;
  categories: BlogCategoryNavItem[];
  activeCategoryName: string;
  /** Mantém só busca + pills fixas; título e descrição rolam com a página. */
  stickyToolbarOnly?: boolean;
}

function CategoryPills({
  categories,
  activeCategoryName,
}: {
  categories: BlogCategoryNavItem[];
  activeCategoryName: string;
}) {
  return (
    <div className="scrollbar-hide -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {categories.map((category) => {
        const isActive = activeCategoryName === category.name;

        return (
          <Link
            key={category.name}
            href={category.link}
            prefetch={INERTIA_PREFETCH_HOVER}
            className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-all sm:text-sm ${
              isActive
                ? "bg-[#003B7A] text-white"
                : "border border-[#003B7A]/12 bg-white text-[#003B7A]/70 hover:border-[#003B7A]/25 hover:text-[#003B7A]"
            }`}
          >
            {category.name}
          </Link>
        );
      })}
    </div>
  );
}

function SearchField({
  searchQuery,
  onSearchChange,
  onSearchFocus,
  searchPlaceholder,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchFocus?: () => void;
  searchPlaceholder: string;
}) {
  return (
    <div className="relative w-full lg:max-w-xs">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#003B7A]/40" />
      <input
        type="search"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value ?? "")}
        onFocus={onSearchFocus}
        placeholder={searchPlaceholder}
        className="h-10 w-full rounded-full border border-[#003B7A]/15 bg-[#F8FAFC] pl-10 pr-4 text-sm text-[#003B7A] outline-none transition-colors placeholder:text-[#003B7A]/35 focus:border-[#009739]/50 focus:bg-white"
        aria-label={searchPlaceholder}
      />
    </div>
  );
}

export function BlogDenseStickyHeader({
  eyebrow,
  title,
  description,
  searchQuery,
  onSearchChange,
  onSearchFocus,
  searchPlaceholder = "Buscar no blog...",
  categories,
  activeCategoryName,
  stickyToolbarOnly = false,
}: BlogDenseStickyHeaderProps) {
  if (stickyToolbarOnly) {
    return (
      <>
        <div className="border-b border-[#003B7A]/8 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#009739]">
              {eyebrow}
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-[#003B7A] sm:text-3xl">{title}</h1>
            {description && (
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#003B7A]/60 sm:text-base">
                {description}
              </p>
            )}
          </div>
        </div>

        <div
          className={`sticky z-40 border-b border-[#003B7A]/10 bg-white/95 backdrop-blur-md ${BLOG_DENSE_NAV_OFFSET_CLASS}`}
        >
          <div className="mx-auto max-w-7xl space-y-3 px-4 py-3 sm:px-6 sm:py-3.5">
            <SearchField
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
              onSearchFocus={onSearchFocus}
              searchPlaceholder={searchPlaceholder}
            />
            <CategoryPills categories={categories} activeCategoryName={activeCategoryName} />
          </div>
        </div>
      </>
    );
  }

  return (
    <div
      className={`sticky z-40 border-b border-[#003B7A]/10 bg-white/95 backdrop-blur-md ${BLOG_DENSE_NAV_OFFSET_CLASS}`}
    >
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#009739]">
              {eyebrow}
            </p>
            <h1 className="text-2xl font-black tracking-tight text-[#003B7A] sm:text-3xl">{title}</h1>
            {description && (
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[#003B7A]/60">{description}</p>
            )}
          </div>

          <SearchField
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            onSearchFocus={onSearchFocus}
            searchPlaceholder={searchPlaceholder}
          />
        </div>

        <div className="mt-3">
          <CategoryPills categories={categories} activeCategoryName={activeCategoryName} />
        </div>
      </div>
    </div>
  );
}
