export function PlansTrainingsSectionFallback() {
  return (
    <section
      className="relative overflow-hidden bg-[#003B7A] px-4 py-14 md:py-24"
      aria-hidden
    >
      <div className="relative mx-auto w-full max-w-5xl">
        <div className="mb-10 space-y-3 text-center md:mb-14">
          <div className="mx-auto h-3 w-32 animate-pulse rounded-full bg-white/10" />
          <div className="mx-auto h-9 w-full max-w-lg animate-pulse rounded-xl bg-white/8" />
          <div className="mx-auto h-4 w-full max-w-2xl animate-pulse rounded-lg bg-white/6" />
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-5 md:mb-10">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-[220px] animate-pulse rounded-[1.35rem] border border-white/15 bg-white/8 md:h-[240px]"
            />
          ))}
        </div>

        <div className="h-12 animate-pulse rounded-2xl border border-white/15 bg-white/8" />
      </div>
    </section>
  );
}
