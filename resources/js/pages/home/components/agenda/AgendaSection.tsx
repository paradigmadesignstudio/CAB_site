import { Link } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/pages/ui/button";
import { AgendaFullWidthSlider } from "./AgendaFullWidthSlider";
import type { AgendaEvent } from "@/types/agenda";

interface AgendaSectionProps {
  events?: AgendaEvent[] | null;
}

export function AgendaSection({ events }: AgendaSectionProps) {
  return (
    <section id="agenda" className="relative overflow-hidden bg-gradient-to-b from-white to-[#003B7A]/5 max-md:scroll-mt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-12 md:pt-20 pb-6 sm:pb-10 md:pb-12">
        <div className="text-center">
          <span className="mb-2 inline-block font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#009739]">
            Próximos encontros
          </span>

          <h2 className="pb-1 text-3xl font-black tracking-tight text-[#003B7A] sm:text-4xl md:text-5xl">
            Agenda CAB
          </h2>

          <div className="mx-auto mt-3 h-[2px] w-12 rounded-full bg-[#009739]" />

          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-sm sm:text-base">
            Congressos, workshops e encontros técnicos para você acompanhar o que está acontecendo
            e o que vem por aí na comunidade CAB.
          </p>

          <Button
            asChild
            variant="outline"
            className="mt-5 rounded-full border-[#003B7A]/30 font-bold text-[#003B7A] hover:bg-[#003B7A]/5"
          >
            <Link href="/blog/eventos">
              Ver todos os eventos <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <AgendaFullWidthSlider events={events} />
    </section>
  );
}

function AgendaSectionFallback() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#003B7A]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <div className="h-32 animate-pulse rounded-2xl bg-[#003B7A]/8" />
      </div>
      <div className="min-h-[min(72vh,640px)] animate-pulse bg-[#081A33]/80" />
    </section>
  );
}

export { AgendaSectionFallback };
