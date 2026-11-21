import { Search, Filter } from "lucide-react";
import type { PartnerCategory } from "@/pages/partners/types";

interface PartnerSearchProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  showCategoryFilter?: boolean;
  categories: PartnerCategory[];
}

const inputClassName =
  "h-14 w-full rounded-2xl border-2 border-[#003B7A]/15 bg-white/95 pl-12 pr-4 text-sm font-medium shadow-[0_8px_30px_-12px_rgba(0,59,122,0.2)] outline-none backdrop-blur-sm transition-all placeholder:text-[#003B7A]/35 focus:border-[#009739]/50 focus:ring-2 focus:ring-[#009739]/20";

export function PartnerSearch({
  searchTerm,
  onSearchTermChange,
  selectedCategory,
  onCategoryChange,
  showCategoryFilter = false,
  categories,
}: PartnerSearchProps) {
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6">
      <p className="mb-4 text-center font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#003B7A]/45">
        Buscar parceiros
      </p>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#003B7A]/40" />
          <input
            type="text"
            placeholder="Pesquisar por nome ou patrocinador..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className={inputClassName}
            aria-label="Pesquisar parceiros"
          />
        </div>

        {showCategoryFilter && (
          <div className="relative md:w-56">
            <Filter className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#003B7A]/40" />
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className={`${inputClassName} cursor-pointer appearance-none pr-10`}
              aria-label="Filtrar por categoria"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
              <svg className="h-4 w-4 text-[#003B7A]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
