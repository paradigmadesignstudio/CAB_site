import { AgendaStatusBadge } from "@/pages/components/agenda/AgendaStatusBadge";
import type { AgendaEventDetail } from "@/types/agenda";
import {
  canShowEventPurchase,
  EventPurchaseButton,
} from "@/pages/events/show/components/EventPurchaseButton";

export function EventDetailTicketCard({ event }: { event: AgendaEventDetail }) {
  const showPurchase = canShowEventPurchase(event);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm">
      {showPurchase && (
        <div className="border-b border-white/10 px-5 py-5">
          <EventPurchaseButton event={event} />
          <p className="pt-3 text-center text-[11px] leading-relaxed text-white/35">
            Você será redirecionado para o site de inscrições.
          </p>
        </div>
      )}

      <div className="space-y-0 px-5 py-5">
        <div className="flex items-center justify-between gap-3 pb-4">
          <span className="text-sm text-white/50">Status</span>
          <AgendaStatusBadge status={event.status} tone="dark" />
        </div>

        <div className="space-y-1 border-t border-white/10 py-4">
          <p className="text-sm text-white/50">Data e horário</p>
          <p className="text-sm font-semibold text-white">
            {event.date}
            <span className="font-normal text-white/55"> · {event.time}</span>
          </p>
        </div>

        <div className="space-y-1 border-t border-white/10 py-4">
          <p className="text-sm text-white/50">Local</p>
          <p className="text-sm font-semibold text-white">{event.venue.name}</p>
          <p className="text-xs leading-relaxed text-white/50">
            {event.venue.address} — {event.venue.city}, {event.venue.state}
          </p>
        </div>

        <div className="space-y-1 border-t border-white/10 py-4">
          <p className="text-sm text-white/50">Organização</p>
          <p className="text-sm font-semibold text-white">{event.organizer}</p>
        </div>
      </div>
    </div>
  );
}
