import { useDeferredValue, useMemo, useState } from "react";
import { FileText, Search } from "lucide-react";
import { ASSOCIATE_AREA_LINK_PROPS } from "@/pages/components/layout/data/navigation";
import type {
  AcademyPlatformMaterialCard,
  AcademyPlatformMaterialsSectionContent,
} from "@/pages/academy/types";
import { cn } from "@/lib/utils";

function normalizeSearchTerm(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

interface AcademyPlatformMaterialsCatalogProps {
  materials: AcademyPlatformMaterialCard[];
  catalog: AcademyPlatformMaterialsSectionContent["catalog"];
  exclusiveBadge: string;
}

export function AcademyPlatformMaterialsCatalog({
  materials,
  catalog,
  exclusiveBadge,
}: AcademyPlatformMaterialsCatalogProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filteredMaterials = useMemo(() => {
    const normalizedQuery = normalizeSearchTerm(deferredQuery);

    if (normalizedQuery === "") {
      return materials;
    }

    return materials.filter((material) => {
      const haystack = normalizeSearchTerm(`${material.title} ${material.category}`);

      return haystack.includes(normalizedQuery);
    });
  }, [deferredQuery, materials]);

  return (
    <div className="rounded-[1.35rem] border border-[#003B7A]/12 bg-white/95 p-4 shadow-[0_16px_40px_-24px_rgba(0,59,122,0.25)] sm:p-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-black text-[#003B7A] sm:text-xl">{catalog.title}</h3>
          <p className="mt-1 max-w-2xl text-sm text-[#003B7A]/60">{catalog.description}</p>
        </div>

        <label className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#003B7A]/40" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={catalog.searchPlaceholder}
            className="h-11 w-full rounded-xl border border-[#003B7A]/15 bg-[#FAFBFC] pl-10 pr-4 text-sm text-[#003B7A] outline-none transition-colors placeholder:text-[#003B7A]/40 focus:border-[#009739]/40"
          />
        </label>
      </div>

      <div
        className={cn(
          "max-h-[28rem] space-y-2 overflow-y-auto pr-1",
          deferredQuery !== query && "opacity-70",
        )}
      >
        {filteredMaterials.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[#003B7A]/15 px-4 py-8 text-center text-sm text-[#003B7A]/55">
            {catalog.emptyResults}
          </p>
        ) : (
          filteredMaterials.map((material) => (
            <a
              key={material.id}
              {...ASSOCIATE_AREA_LINK_PROPS}
              className="group flex items-start gap-3 rounded-xl border border-transparent px-3 py-3 transition-colors hover:border-[#009739]/20 hover:bg-[#009739]/5"
            >
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#003B7A]/6 text-[#003B7A]/70">
                <FileText className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#009739]/80">
                  {material.category}
                </span>
                <span className="line-clamp-2 text-sm font-bold leading-snug text-[#003B7A] transition-colors group-hover:text-[#009739]">
                  {material.title}
                </span>
              </span>
              <span className="hidden shrink-0 rounded-full bg-[#003B7A]/6 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#003B7A]/55 sm:inline-flex">
                {exclusiveBadge}
              </span>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
