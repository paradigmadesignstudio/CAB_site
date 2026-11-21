import { CheckCircle2 } from "lucide-react";
import { EventDetailSectionHeader } from "./EventDetailSectionHeader";
import type { AgendaEventDetail } from "@/types/agenda";

interface EventDetailAboutProps {
  event: AgendaEventDetail;
}

export function EventDetailAbout({ event }: EventDetailAboutProps) {
  return (
    <section>
      <EventDetailSectionHeader label="Sobre" title="O evento" />

      <div className="space-y-4">
        {event.description.map((paragraph) => (
          <p key={paragraph.slice(0, 32)} className="text-sm leading-relaxed text-white/65 sm:text-base">
            {paragraph}
          </p>
        ))}
      </div>

      <ul className="mt-8 space-y-3">
        {event.highlights.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm text-white/80">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#AFFF00]" />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-2">
        {event.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-white/55"
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}
