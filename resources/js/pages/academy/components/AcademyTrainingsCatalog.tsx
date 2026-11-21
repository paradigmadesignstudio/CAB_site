import { useDeferredValue, useMemo, useState } from "react";
import { BookOpen, ChevronRight, Search } from "lucide-react";
import type { TrainingDetailItem, TrainingRow } from "@/pages/plans/components/training-types";
import type { AcademyTrainingsSectionContent } from "@/pages/academy/types";
import { cn } from "@/lib/utils";

function minimumPlanShortLabel(row: TrainingRow): string {
  if (row.p1) {
    return "1.4";
  }

  if (row.p2) {
    return "2.0";
  }

  return "3.0";
}

function normalizeSearchTerm(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

interface AcademyTrainingsCatalogProps {
  trainings: TrainingDetailItem[];
  catalog: AcademyTrainingsSectionContent["catalog"];
  onOpenAtIndex: (index: number) => void;
}

export function AcademyTrainingsCatalog({
  trainings,
  catalog,
  onOpenAtIndex,
}: AcademyTrainingsCatalogProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filteredEntries = useMemo(() => {
    const normalizedQuery = normalizeSearchTerm(deferredQuery);

    if (normalizedQuery === "") {
      return trainings.map((training, index) => ({ training, index }));
    }

    return trainings
      .map((training, index) => ({ training, index }))
      .filter(({ training }) => {
        const haystack = normalizeSearchTerm(`${training.label} ${training.category} ${training.n}`);

        return haystack.includes(normalizedQuery);
      });
  }, [deferredQuery, trainings]);

  if (trainings.length === 0) {
    return null;
  }

  return (
    <div
      id="catalogo-treinamentos"
      className="mt-12 rounded-[1.5rem] border border-[#003B7A]/12 bg-white/95 p-4 shadow-[0_16px_48px_-28px_rgba(0,59,122,0.35)] sm:mt-14 sm:p-6"
    >
      <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h3 className="text-xl font-black tracking-tight text-[#003B7A] sm:text-2xl">{catalog.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#003B7A]/65">{catalog.description}</p>
        </div>

        <label className="relative w-full sm:max-w-sm">
          <span className="sr-only">{catalog.searchPlaceholder}</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#003B7A]/40" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={catalog.searchPlaceholder}
            className={cn(
              "h-11 w-full rounded-xl border border-[#003B7A]/15 bg-[#FAFBFC] pl-10 pr-4 text-sm text-[#003B7A]",
              "outline-none transition-colors placeholder:text-[#003B7A]/40 focus:border-[#009739]",
            )}
          />
        </label>
      </div>

      <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#003B7A]/45">
        {filteredEntries.length} de {trainings.length} treinamentos
      </p>

      <div className="max-h-[28rem] overflow-y-auto rounded-2xl border border-[#003B7A]/8 bg-[#FAFBFC]/80 pr-1">
        {filteredEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <BookOpen className="mb-3 size-8 text-[#003B7A]/30" aria-hidden />
            <p className="text-sm font-medium text-[#003B7A]/60">{catalog.emptyResults}</p>
          </div>
        ) : (
          <ul className="divide-y divide-[#003B7A]/8">
            {filteredEntries.map(({ training, index }) => (
              <li key={`${training.n}-${training.label}`}>
                <button
                  type="button"
                  onClick={() => onOpenAtIndex(index)}
                  className={cn(
                    "group flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors",
                    "hover:bg-white focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#009739]/35",
                    "sm:items-center sm:gap-4 sm:px-5",
                  )}
                >
                  <span className="shrink-0 font-mono text-xs font-bold tabular-nums text-[#003B7A]/45 sm:w-8">
                    {training.n}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold leading-snug text-[#003B7A] group-hover:text-[#009739]">
                      {training.label}
                    </span>
                    <span className="mt-1 block text-[11px] font-medium text-[#003B7A]/50 sm:hidden">
                      {training.lessonCount} {training.lessonCount === 1 ? "aula" : "aulas"} · Plataforma{" "}
                      {minimumPlanShortLabel(training)}
                    </span>
                  </span>

                  <span className="hidden shrink-0 items-center gap-2 sm:flex">
                    <span className="rounded-full bg-[#003B7A]/6 px-2.5 py-1 text-[10px] font-bold text-[#003B7A]/70">
                      {training.lessonCount} {training.lessonCount === 1 ? "aula" : "aulas"}
                    </span>
                    <span className="rounded-full bg-[#009739]/10 px-2.5 py-1 text-[10px] font-bold text-[#009739]">
                      Plataforma {minimumPlanShortLabel(training)}
                    </span>
                  </span>

                  <ChevronRight className="mt-0.5 size-4 shrink-0 text-[#003B7A]/25 transition-transform group-hover:translate-x-0.5 group-hover:text-[#009739] sm:mt-0" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
