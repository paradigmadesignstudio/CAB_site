import { Link } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";
import { PremiumHeroHeader } from "@/pages/components/premium";

export function HeroColumnists() {
  return (
    <PremiumHeroHeader
      badge="Colunistas CAB"
      title={
        <>
          Nossos <span className="text-[#009739]">Especialistas</span>
        </>
      }
      description="Conheça os profissionais que compartilham conhecimento técnico de ponta no blog da CAB."
      footer={
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-xl bg-[#009739] px-6 py-3 font-bold text-white shadow-[0_8px_24px_-8px_rgba(0,151,57,0.6)] transition-all hover:-translate-y-0.5 hover:bg-[#00b344]"
        >
          Ver todos os artigos
          <ArrowRight className="h-4 w-4" />
        </Link>
      }
    />
  );
}
