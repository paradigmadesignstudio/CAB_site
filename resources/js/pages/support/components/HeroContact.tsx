import { ArrowRight } from "lucide-react";
import { PremiumHeroHeader } from "@/pages/components/premium";

export function HeroContact() {
  return (
    <PremiumHeroHeader
      badge="Central de Atendimento"
      title={
        <>
          Fale com a <span className="text-[#009739]">CAB</span>
        </>
      }
      description="Nossa equipe está pronta para ajudar você. Escolha o canal de sua preferência e entraremos em contato o mais breve possível."
      footer={
        <a
          href="#formulario"
          className="inline-flex items-center gap-2 rounded-xl bg-[#003B7A] px-8 py-3.5 font-semibold text-white shadow-[0_12px_32px_-14px_rgba(0,59,122,0.45)] transition-all hover:-translate-y-0.5 hover:bg-[#002B5A]"
        >
          Enviar mensagem
          <ArrowRight className="h-5 w-5" />
        </a>
      }
    />
  );
}
