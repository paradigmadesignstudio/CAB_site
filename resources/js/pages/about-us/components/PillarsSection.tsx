import { motion } from "framer-motion";
import { useLightMotion } from "@/hooks/useLightMotion";
import { PremiumSectionHeader } from "@/pages/components/premium";
import { resolveLucideIcon } from "@/lib/lucideIconMap";
import type { AboutPillar } from "@/pages/about-us/types";

export function PillarsSection({ pillars }: { pillars: AboutPillar[] }) {
  const useStaticMotion = useLightMotion();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <PremiumSectionHeader
        label="Ecossistema"
        title="Os Nossos Pilares de Atuação"
        description="Muito mais do que suporte. Um ecossistema de evolução."
        className="text-center [&_h2]:mx-auto [&_p]:mx-auto"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
        {pillars.map((pillar, index) => {
          const Icon = resolveLucideIcon(pillar.icon);

          return (
            <motion.article
              key={pillar.title}
              initial={useStaticMotion ? false : { opacity: 0, y: 30 }}
              whileInView={useStaticMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={useStaticMotion ? undefined : { once: true }}
              transition={useStaticMotion ? undefined : { delay: index * 0.1 }}
              className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] border-2 border-[#003B7A]/12 bg-white p-6 text-center shadow-[0_12px_40px_-16px_rgba(0,59,122,0.2)] transition-all duration-300 hover:border-[#009739]/35 hover:shadow-[0_20px_50px_-18px_rgba(0,59,122,0.3)] sm:p-8"
            >
              <div
                className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl ${pillar.bgColor} transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon className={`h-10 w-10 ${pillar.color}`} />
              </div>
              <h3 className="mb-4 text-xl font-black tracking-tight text-[#003B7A] sm:text-2xl">
                {pillar.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#003B7A]/65 sm:text-base">
                {pillar.description}
              </p>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
