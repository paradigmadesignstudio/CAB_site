import { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/pages/ui/button";
import { AgendaStatusBadge } from "@/pages/components/agenda/AgendaStatusBadge";
import type { AgendaEvent } from "@/types/agenda";

interface AgendaFullWidthSliderProps {
  events?: AgendaEvent[] | null;
}

const FEATURED_SLIDE_MS = 11000;
const PAST_SLIDE_MS = 4000;
/** Mesma largura aceita por CabMediaDerivative na home. */
const HOME_BANNER_WIDTH = 1600;

function homeBannerSrc(src: string): string {
  if (!src.startsWith("/media/")) {
    return src;
  }

  return src.includes("?") ? `${src}&w=${HOME_BANNER_WIDTH}` : `${src}?w=${HOME_BANNER_WIDTH}`;
}

function slideDuration(event: AgendaEvent | undefined): number {
  if (!event || event.status === "ended") {
    return PAST_SLIDE_MS;
  }

  return FEATURED_SLIDE_MS;
}

function EventSlideContent({ event }: { event: AgendaEvent }) {
  return (
    <div className="max-w-2xl">
      <AgendaStatusBadge status={event.status} tone="dark" className="mb-4" />
      <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#AFFF00]">
        Agenda CAB
      </p>
      <h2 className="mb-4 text-3xl font-black leading-[1.05] tracking-tight text-white sm:text-4xl md:text-5xl">
        {event.title}
      </h2>
      <p className="mb-6 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
        {event.excerpt}
      </p>

      <div className="mb-8 flex flex-wrap gap-4 text-sm font-semibold text-white/90">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5">
          <Calendar className="h-4 w-4 text-[#AFFF00]" />
          {event.date} · {event.time}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5">
          <MapPin className="h-4 w-4 text-[#AFFF00]" />
          {event.location}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          asChild
          className="h-12 rounded-full bg-[#009739] px-6 font-bold text-white hover:bg-[#007a2e]"
        >
          <Link href={event.link}>
            Ver evento <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-12 rounded-full border-white/30 bg-white/5 px-6 font-bold text-white hover:bg-white/10 hover:text-white"
        >
          <Link href="/blog/eventos">Ver agenda completa</Link>
        </Button>
      </div>
    </div>
  );
}

function SlideControls({
  items,
  index,
  onSelect,
  onGo,
}: {
  items: AgendaEvent[];
  index: number;
  onSelect: (nextIndex: number) => void;
  onGo: (direction: -1 | 1) => void;
}) {
  if (items.length <= 1) {
    return null;
  }

  return (
    <div className="mt-8 flex items-center justify-between gap-4">
      <div className="flex gap-2">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(i)}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-8 bg-[#AFFF00]" : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Ir para evento ${i + 1}`}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onGo(-1)}
          className="h-10 w-10 rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20"
          aria-label="Evento anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onGo(1)}
          className="h-10 w-10 rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20"
          aria-label="Próximo evento"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

export function AgendaFullWidthSlider({ events }: AgendaFullWidthSliderProps) {
  const items = events ?? [];
  const [index, setIndex] = useState(0);
  const [allowNextSlide, setAllowNextSlide] = useState(false);
  const event = items[index] ?? items[0];
  const nextIndex = items.length > 0 ? (index + 1) % items.length : 0;

  useEffect(() => {
    const timer = window.setTimeout(() => setAllowNextSlide(true), 2500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!allowNextSlide || items.length <= 1) {
      return;
    }

    const next = items[nextIndex];
    if (!next?.image) {
      return;
    }

    const preload = new Image();
    preload.decoding = "async";
    preload.src = homeBannerSrc(next.image);
  }, [allowNextSlide, items, nextIndex]);

  useEffect(() => {
    setIndex(0);
  }, [events]);

  useEffect(() => {
    if (items.length <= 1) {
      return;
    }

    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, slideDuration(event));

    return () => clearTimeout(timer);
  }, [event, index, items.length]);

  if (!event) {
    return null;
  }

  const go = (direction: -1 | 1) => {
    setIndex((prev) => (prev + direction + items.length) % items.length);
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#081A33]">
      <div className="relative min-h-[min(72vh,640px)] w-full">
        <div className="absolute inset-0">
          <img
            key={event.id}
            src={homeBannerSrc(event.image)}
            alt={event.title}
            className="h-full w-full object-cover"
            decoding="async"
            loading="lazy"
            fetchPriority="low"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#003B7A]/95 via-[#003B7A]/75 to-[#003B7A]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#081A33] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[min(72vh,640px)] max-w-7xl flex-col justify-end px-4 pb-10 pt-24 sm:px-6 sm:pb-14">
          <EventSlideContent event={event} />
          <SlideControls items={items} index={index} onSelect={setIndex} onGo={go} />
        </div>
      </div>
    </section>
  );
}
