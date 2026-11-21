import { Link } from "@inertiajs/react";
import { ArrowRight, Sparkles } from "lucide-react";

export function PlansCTA() {
  return (
    <div className="relative overflow-hidden rounded-[1.35rem] border-2 border-[#003B7A]/15 bg-gradient-to-br from-[#003B7A] via-[#002952] to-[#081A33] p-6 shadow-[0_16px_48px_-24px_rgba(0,59,122,0.35)] sm:p-8">
      <div className="pointer-events-none absolute -right-8 top-0 h-32 w-32 rounded-full bg-[#009739]/25 blur-[50px]" aria-hidden />

      <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#AFFF00]" />
            <h3 className="text-lg font-black text-white">Quer ver sua oficina aqui?</h3>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/75">
            Assine um plano e faça parte da maior rede de especialistas em câmbio automático do Brasil, atraindo mais clientes.
          </p>
        </div>
        <Link
          href="/planos"
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-white px-5 font-bold text-[#003B7A] shadow-lg transition-all hover:-translate-y-0.5 hover:bg-white/95"
        >
          Conheça nossos planos
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
