/**
 * Card de evento — estilo "inverted-bottom" (id: inverted-bottom).
 * Conteúdo no topo, imagem na base, rounded-xl.
 * Reutilizar em outras páginas importando este componente.
 */
import { Link } from "@inertiajs/react";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlogCardImage } from "@/pages/blog/components/BlogCardImage";
import type { AgendaEvent } from "@/types/agenda";
import { AgendaStatusBadge } from "./AgendaStatusBadge";

interface AgendaInvertedBottomCardProps {
  event: AgendaEvent;
  className?: string;
}

function AgendaInvertedBottomCardMeta({ event }: { event: AgendaEvent }) {
  return (
    <>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <AgendaStatusBadge status={event.status} />
        <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {event.date} · {event.time}
        </span>
      </div>
      <h3 className="mb-1.5 line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-[#003B7A] sm:text-base">
        {event.title}
      </h3>
      <p className="mb-2 line-clamp-2 text-[11px] text-muted-foreground">{event.excerpt}</p>
      <div className="mb-3 flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
        <MapPin className="h-3 w-3 shrink-0" />
        <span className="line-clamp-1">{event.location}</span>
      </div>
      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#009739] transition-all group-hover:gap-2">
        Ver detalhes <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </>
  );
}

export function AgendaInvertedBottomCard({ event, className }: AgendaInvertedBottomCardProps) {
  return (
    <Link href={event.link} className={cn("group block h-full", className)}>
      <article
        className={cn(
          "flex h-full w-full flex-col overflow-hidden rounded-xl border border-[#003B7A]/15 bg-card shadow-[0_10px_32px_-16px_rgba(0,59,122,0.22)] transition-all hover:border-[#003B7A]/30 hover:shadow-[0_16px_40px_-14px_rgba(0,59,122,0.28)]",
        )}
      >
        <div className="order-1 flex flex-1 flex-col bg-[#003B7A]/5 p-4 sm:p-5">
          <AgendaInvertedBottomCardMeta event={event} />
        </div>
        <BlogCardImage
          image={event.image}
          mobileImage={event.imageMobile}
          alt={event.title}
          className="order-2 aspect-[16/9] w-full"
          fallbackLabel="CAB"
        />
      </article>
    </Link>
  );
}
