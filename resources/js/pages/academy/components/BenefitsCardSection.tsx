import { motion } from "framer-motion";
import { useLightMotion } from "@/hooks/useLightMotion";
import { PremiumSectionHeader } from "@/pages/components/premium";
import { resolveLucideIcon } from "@/lib/lucideIconMap";
import type { AcademyPageContent } from "@/pages/academy/types";

interface BenefitsCardsSectionProps {
  content: AcademyPageContent["benefitsSection"];
}

export function BenefitsCardsSection({ content }: BenefitsCardsSectionProps) {
  const light = useLightMotion();
  return (
    <div id="beneficios" className="mx-auto max-w-5xl px-4 sm:px-6">
      <PremiumSectionHeader
        label="Benefícios"
        title={`${content.title} ${content.titleHighlight}`}
        description={content.description}
        className="text-center [&_h2]:mx-auto [&_p]:mx-auto"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
        {content.items.map((benefit, index) => {
          const Icon = resolveLucideIcon(benefit.icon);

          return (
          <motion.article
            key={benefit.title}
            initial={light ? false : { opacity: 0, y: 30 }}
            whileInView={light ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: light ? 0 : 0.4, delay: light ? 0 : index * 0.1 }}
            className="group flex flex-col items-center overflow-hidden rounded-[1.35rem] border-2 border-[#003B7A]/12 bg-white p-6 text-center shadow-[0_12px_40px_-16px_rgba(0,59,122,0.2)] transition-all duration-300 hover:border-[#009739]/35 hover:shadow-[0_20px_50px_-18px_rgba(0,59,122,0.3)]"
          >
            <div className="mb-4 rounded-2xl bg-[#003B7A]/8 p-4 ring-1 ring-[#003B7A]/12 transition-colors group-hover:bg-[#009739]/10 group-hover:ring-[#009739]/20">
              <Icon className="h-7 w-7 text-[#003B7A] transition-colors group-hover:text-[#009739]" />
            </div>
            <h3 className="mb-2 text-lg font-black tracking-tight text-[#003B7A]">{benefit.title}</h3>
            <p className="text-sm leading-relaxed text-[#003B7A]/65">{benefit.description}</p>
          </motion.article>
          );
        })}
      </div>
    </div>
  );
}
