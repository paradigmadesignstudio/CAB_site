import { Link } from "@inertiajs/react";
import { ArrowRight, CalendarDays } from "lucide-react";
import { AgendaInvertedBottomCard } from "@/pages/components/agenda/AgendaInvertedBottomCard";
import type { AgendaEvent } from "@/types/agenda";

interface BlogEventsPreviewSectionProps {
  upcomingEvents: AgendaEvent[];
}

export function BlogEventsPreviewSection({ upcomingEvents }: BlogEventsPreviewSectionProps) {
  if (upcomingEvents.length === 0) {
    return (
      <section className="border-b border-[#003B7A]/8 bg-gradient-to-b from-white to-[#003B7A]/[0.03] py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-1 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.26em] text-[#009739]">
                <CalendarDays className="h-3.5 w-3.5" />
                Agenda CAB
              </p>
              <h2 className="text-xl font-black text-[#003B7A] sm:text-2xl">Próximos encontros</h2>
              <p className="mt-1 max-w-xl text-sm text-[#003B7A]/60">
                Congressos, workshops e encontros técnicos da comunidade CAB.
              </p>
            </div>
            <Link
              href="/blog/eventos"
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-[#003B7A]/15 px-4 text-xs font-bold text-[#003B7A] transition-colors hover:border-[#009739]/35 hover:text-[#009739]"
            >
              Ver agenda completa <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-6 rounded-xl border border-dashed border-[#003B7A]/15 bg-white/80 px-6 py-10 text-center">
            <p className="text-sm font-bold text-[#003B7A]">Nenhum evento na agenda no momento</p>
            <p className="mt-1 text-sm text-[#003B7A]/55">Volte em breve ou confira eventos anteriores.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-[#003B7A]/8 bg-gradient-to-b from-white to-[#003B7A]/[0.03] py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.26em] text-[#009739]">
              <CalendarDays className="h-3.5 w-3.5" />
              Agenda CAB
            </p>
            <h2 className="text-xl font-black text-[#003B7A] sm:text-2xl">Próximos encontros</h2>
            <p className="mt-1 max-w-xl text-sm text-[#003B7A]/60">
              Congressos, workshops e encontros técnicos para acompanhar a comunidade CAB.
            </p>
          </div>
          <Link
            href="/blog/eventos"
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-[#003B7A]/15 px-4 text-xs font-bold text-[#003B7A] transition-colors hover:border-[#009739]/35 hover:text-[#009739]"
          >
            Ver agenda completa <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.map((event) => (
            <AgendaInvertedBottomCard key={event.id} event={event} className="h-full" />
          ))}
        </div>
      </div>
    </section>
  );
}
