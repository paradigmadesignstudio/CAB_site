import { AgendaInvertedBottomCard } from "@/pages/components/agenda/AgendaInvertedBottomCard";
import { EventDetailSectionHeader } from "./EventDetailSectionHeader";
import type { AgendaEvent } from "@/types/agenda";

interface EventDetailRelatedProps {
  events: AgendaEvent[];
}

export function EventDetailRelated({ events }: EventDetailRelatedProps) {
  if (events.length === 0) {
    return null;
  }

  return (
    <section>
      <EventDetailSectionHeader label="Agenda CAB" title="Outros encontros" />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <AgendaInvertedBottomCard key={event.id} event={event} className="h-full" />
        ))}
      </div>
    </section>
  );
}
