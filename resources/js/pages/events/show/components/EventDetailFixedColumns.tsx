import type { ReactNode } from "react";
import { EventDetailPoster } from "./EventDetailBlurBackdrop";
import { EventDetailTicketCard } from "./EventDetailSidebar";
import type { AgendaEventDetail } from "@/types/agenda";

interface EventDetailFixedColumnsProps {
  event: AgendaEventDetail;
  children: ReactNode;
}

/**
 * Banner no topo + grid de 2 colunas (conteúdo | card).
 * A coluna do card estica até o fim do conteúdo para o sticky funcionar.
 */
export function EventDetailFixedColumns({ event, children }: EventDetailFixedColumnsProps) {
  return (
    <div className="relative">
      <div className="mb-8 w-full lg:mb-10">
        <EventDetailPoster event={event} layout="hero" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(260px,300px)] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-14 sm:space-y-16">{children}</div>

        <aside className="relative hidden lg:block">
          <div className="sticky top-24 z-20 sm:top-28">
            <EventDetailTicketCard event={event} />
          </div>
        </aside>
      </div>
    </div>
  );
}
