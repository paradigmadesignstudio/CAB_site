import { ArrowRight, Sparkles } from "lucide-react";
import { PremiumHeroHeader } from "@/pages/components/premium";
import type { AcademyHeroContent } from "@/pages/academy/types";

interface HeroAcademiaProps {
  content: AcademyHeroContent;
}

export function HeroAcademia({ content }: HeroAcademiaProps) {
  return (
    <PremiumHeroHeader
      badge={content.badge}
      title={
        <>
          {content.title}{" "}
          <span className="text-[#009739]">{content.titleHighlight}</span>
        </>
      }
      description={content.description}
      footer={
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={content.primaryCta.href}
            className="inline-flex items-center gap-2 rounded-xl bg-[#003B7A] px-8 py-3.5 font-semibold text-white shadow-[0_12px_32px_-14px_rgba(0,59,122,0.45)] transition-all hover:-translate-y-0.5 hover:bg-[#002B5A]"
          >
            <Sparkles className="h-5 w-5" />
            {content.primaryCta.label}
            <ArrowRight className="h-5 w-5" />
          </a>
          <a
            href={content.secondaryCta.href}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[#003B7A]/15 bg-white px-8 py-3.5 font-semibold text-[#003B7A] shadow-sm transition-all hover:border-[#009739]/35 hover:shadow-md"
          >
            {content.secondaryCta.label}
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      }
    />
  );
}
