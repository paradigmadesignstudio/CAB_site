import { Link } from "@inertiajs/react";
import { ArrowRight, GraduationCap } from "lucide-react";

export function PlanCTA() {
  return (
    <div className="relative overflow-hidden rounded-[1.35rem] border-2 border-[#003B7A]/15 bg-gradient-to-br from-[#003B7A] via-[#002952] to-[#081A33] p-6 shadow-[0_16px_48px_-24px_rgba(0,59,122,0.35)] sm:p-8">
      <div className="pointer-events-none absolute -right-8 top-0 h-32 w-32 rounded-full bg-[#009739]/25 blur-[50px]" aria-hidden />

      <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <div className="shrink-0 rounded-full bg-[#009739]/20 p-2.5">
            <GraduationCap className="h-6 w-6 text-[#AFFF00]" />
          </div>
          <div>
            <p className="font-black text-white">Pronto para colocar em prática?</p>
            <p className="mt-1 max-w-md text-sm leading-relaxed text-white/75">
              Transforme teoria em resultado com acesso aos treinamentos e suporte CAB.
            </p>
          </div>
        </div>
        <Link
          href="/planos"
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-[#009739] px-5 font-bold text-white shadow-[0_8px_24px_-8px_rgba(0,151,57,0.6)] transition-all hover:-translate-y-0.5 hover:bg-[#00b344]"
        >
          Ver planos
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
