import { motion } from "framer-motion";
import { useLightMotion } from "@/hooks/useLightMotion";
import { PremiumSectionHeader } from "@/pages/components/premium";
import { resolveLucideIcon } from "@/lib/lucideIconMap";
import type { AboutTimelineItem } from "@/pages/about-us/types";

export function TimelineSection({ items }: { items: AboutTimelineItem[] }) {
  const useStaticMotion = useLightMotion();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <PremiumSectionHeader
        label="História"
        title="A Nossa Jornada"
        description="Acompanhe a evolução da nossa plataforma e os marcos que nos trouxeram até aqui."
        className="mb-16 text-center md:mb-24 [&_h2]:mx-auto [&_p]:mx-auto"
      />

      <div className="relative">
        <div className="absolute left-[10%] right-[10%] top-[2.5rem] hidden h-1 rounded-full bg-gradient-to-r from-transparent via-[#009739]/50 to-transparent md:block" />

        <div className="absolute bottom-[5%] left-[2.4rem] top-[5%] w-1 rounded-full bg-gradient-to-b from-transparent via-[#009739]/50 to-transparent md:hidden" />

        <div className="relative z-10 flex flex-col justify-between gap-12 md:flex-row md:gap-6">
          {items.map((item, index) => {
            const Icon = resolveLucideIcon(item.icon);

            return (
              <motion.div
                key={item.year}
                initial={useStaticMotion ? false : { opacity: 0, y: 40 }}
                whileInView={useStaticMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={useStaticMotion ? undefined : { once: true, margin: "-50px" }}
                transition={
                  useStaticMotion
                    ? undefined
                    : { delay: index * 0.2, duration: 0.6, ease: "easeOut" }
                }
                className="flex flex-1 flex-row items-start gap-6 md:flex-col md:items-center md:gap-8"
              >
                <div className="group relative flex w-20 shrink-0 cursor-default flex-col items-center md:w-auto">
                  <div className="absolute inset-0 scale-150 rounded-full bg-[#009739]/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="z-10 flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#003B7A] bg-white text-[#003B7A] shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-[#003B7A] group-hover:text-white">
                    <Icon className="h-8 w-8" />
                  </div>

                  <div className="mt-4 transform rounded-full bg-[#003B7A] px-5 py-1.5 font-mono text-sm font-black tracking-wider text-white shadow-xl transition-transform duration-300 group-hover:-translate-y-1 md:mt-6 md:text-lg">
                    {item.year}
                  </div>
                </div>

                <div className="flex-1 pt-2 text-left md:pt-0 md:text-center">
                  <h3 className="mb-2 text-lg font-black text-[#003B7A] sm:text-xl">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-[#003B7A]/65 sm:text-base">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
