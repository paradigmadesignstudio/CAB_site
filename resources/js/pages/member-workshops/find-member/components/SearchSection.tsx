import { Search, MapPin } from "lucide-react";

interface SearchSectionProps {
  selectedState: string;
  onStateChange: (state: string) => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  brazilStates: string[];
}

const inputClassName =
  "h-14 w-full rounded-2xl border-2 border-[#003B7A]/15 bg-white/95 pl-12 pr-4 text-sm font-medium shadow-[0_8px_30px_-12px_rgba(0,59,122,0.2)] outline-none backdrop-blur-sm transition-all placeholder:text-[#003B7A]/35 focus:border-[#009739]/50 focus:ring-2 focus:ring-[#009739]/20";

export function SearchSection({
  selectedState,
  onStateChange,
  searchTerm,
  onSearchTermChange,
  brazilStates,
}: SearchSectionProps) {
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6">
      <p className="mb-4 text-center font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#003B7A]/45">
        Buscar oficinas
      </p>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#003B7A]/40" />
          <input
            type="text"
            placeholder="Pesquisar por nome da oficina ou cidade..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className={inputClassName}
            aria-label="Pesquisar oficinas"
          />
        </div>

        <div className="relative md:w-56">
          <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#003B7A]/40" />
          <select
            value={selectedState}
            onChange={(e) => onStateChange(e.target.value)}
            className={`${inputClassName} cursor-pointer appearance-none pr-10`}
            aria-label="Filtrar por estado"
          >
            <option value="">Todos os Estados</option>
            {brazilStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
            <svg className="h-4 w-4 text-[#003B7A]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
