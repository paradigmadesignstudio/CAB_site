import { CmsResponsiveImage } from "@/pages/components/CmsResponsiveImage";

/** Fundo atmosférico no topo — apenas CSS, sem segunda requisição de imagem. */
export function EventDetailBlurBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[min(70vh,560px)] overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a2550] via-[#003B7A] to-[#002040]" />
      <div className="absolute -right-16 top-0 h-64 w-64 rounded-full bg-[#009739]/20 blur-3xl" />
      <div className="absolute -left-12 top-24 h-48 w-48 rounded-full bg-[#AFFF00]/10 blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent via-[#003B7A]/90 to-[#003B7A]" />
    </div>
  );
}

interface EventDetailPosterProps {
  event: { title: string; image: string; imageMobile?: string | null };
  className?: string;
  layout?: "hero" | "portrait";
}

/** Banner do evento — hero (topo) ou portrait (legado). */
export function EventDetailPoster({
  event,
  className = "",
  layout = "hero",
}: EventDetailPosterProps) {
  const isHero = layout === "hero";

  return (
    <div
      className={`w-full overflow-hidden rounded-2xl shadow-[0_28px_56px_-18px_rgba(0,0,0,0.55)] ring-1 ring-white/15 ${className}`}
    >
      <div
        className={
          isHero
            ? "relative h-[220px] w-full overflow-hidden bg-[#081A33] sm:h-[260px] lg:h-[280px]"
            : "relative aspect-[4/5] overflow-hidden bg-[#081A33]"
        }
      >
        <CmsResponsiveImage
          image={event.image}
          mobileImage={event.imageMobile}
          alt={event.title}
          pictureClassName="block h-full w-full"
          imageClassName="block h-full w-full object-cover object-center"
          decoding="async"
          fetchPriority="high"
        />
        {isHero && (
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#003B7A]/90 via-[#003B7A]/20 to-transparent"
            aria-hidden
          />
        )}
      </div>
    </div>
  );
}
