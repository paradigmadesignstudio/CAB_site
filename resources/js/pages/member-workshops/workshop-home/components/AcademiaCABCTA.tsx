import { Link } from "@inertiajs/react";
import { GraduationCap, ArrowRight } from "lucide-react";

export function AcademiaCABCTA() {
  return (
    <div className="flex h-full flex-col rounded-[1.35rem] border-2 border-[#003B7A]/12 bg-white p-6 shadow-[0_12px_40px_-16px_rgba(0,59,122,0.2)] transition-all hover:border-[#009739]/30">
      <div className="flex flex-1 items-start gap-4">
        <div className="shrink-0 rounded-full bg-[#009739]/10 p-3">
          <GraduationCap className="h-6 w-6 text-[#009739]" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-black text-[#003B7A]">Academia CAB</h3>
          <p className="text-sm leading-relaxed text-[#003B7A]/65">
            Aprenda com os melhores especialistas. Conheça nossos cursos online e presenciais para profissionais de transmissão automática.
          </p>
        </div>
      </div>

      <Link
        href="/academia-cab"
        className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#009739] font-bold text-white shadow-[0_8px_24px_-8px_rgba(0,151,57,0.6)] transition-all hover:-translate-y-0.5 hover:bg-[#00b344]"
      >
        Ver cursos
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
