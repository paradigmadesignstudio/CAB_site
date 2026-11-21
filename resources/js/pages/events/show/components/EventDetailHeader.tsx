import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { AgendaStatusBadge } from "@/pages/components/agenda/AgendaStatusBadge";
import {
  canShowEventPurchase,
  EventPurchaseButton,
} from "@/pages/events/show/components/EventPurchaseButton";
import type { AgendaEventDetail } from "@/types/agenda";

interface EventDetailHeaderProps {
  event: AgendaEventDetail;
}

export function EventDetailHeader({ event }: EventDetailHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.06, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <AgendaStatusBadge status={event.status} tone="dark" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-white/50">
          Agenda CAB
        </span>
      </div>

      <h1 className="text-[1.75rem] font-bold leading-[1.08] tracking-tight text-white sm:text-4xl md:text-[2.75rem]">
        {event.title}
      </h1>

      <div className="mt-5 space-y-2.5">
        <p className="flex items-start gap-3 text-base text-white/90 sm:text-lg">
          <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-[#AFFF00]" />
          <span>
            <span className="font-semibold text-white">{event.date}</span>
            <span className="text-white/65"> · {event.time}</span>
          </span>
        </p>
        <p className="flex items-start gap-3 text-base text-white/90 sm:text-lg">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#AFFF00]" />
          <span>
            <span className="font-semibold text-white">{event.venue.name}</span>
            <span className="block text-sm text-white/60 sm:inline sm:before:content-['_·_']">
              {event.venue.city}, {event.venue.state}
            </span>
          </span>
        </p>
      </div>

      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
        {event.excerpt}
      </p>

      {canShowEventPurchase(event) && (
        <div className="mt-6 lg:hidden">
          <EventPurchaseButton event={event} />
          <p className="mt-3 text-center text-[11px] leading-relaxed text-white/40">
            Você será redirecionado para o site de inscrições.
          </p>
        </div>
      )}
    </motion.header>
  );
}
