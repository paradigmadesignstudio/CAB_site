export function AcademyTrainingsSectionFallback() {
  return (
    <section
      id="treinamentos-plataforma"
      className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14"
      aria-hidden
    >
      <div className="mx-auto mb-10 max-w-2xl space-y-3 text-center">
        <div className="mx-auto h-3 w-28 animate-pulse rounded-full bg-[#003B7A]/10" />
        <div className="mx-auto h-9 w-full max-w-md animate-pulse rounded-xl bg-[#003B7A]/8" />
        <div className="mx-auto h-4 w-full max-w-lg animate-pulse rounded-lg bg-[#003B7A]/6" />
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-2xl border border-[#003B7A]/8 bg-white/80 sm:h-28"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[1.35rem] border border-[#003B7A]/10 bg-white shadow-sm"
          >
            <div className="aspect-[16/10] animate-pulse bg-[#003B7A]/8" />
            <div className="space-y-2 p-4">
              <div className="h-3 w-16 animate-pulse rounded bg-[#003B7A]/8" />
              <div className="h-4 w-full animate-pulse rounded bg-[#003B7A]/10" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-[#003B7A]/6" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
