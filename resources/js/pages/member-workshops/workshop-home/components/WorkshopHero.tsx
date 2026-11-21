import { motion } from "framer-motion";
import { useLightMotion } from "@/hooks/useLightMotion";
import { WorkshopLogo } from "@/pages/member-workshops/components/WorkshopLogo";
import type { Workshop } from "@/pages/member-workshops/types";

interface WorkshopHeroProps {
  workshop: Pick<Workshop, "name" | "logo" | "category">;
}

export function WorkshopHero({ workshop }: WorkshopHeroProps) {
  const useStaticMotion = useLightMotion();

  return (
    <motion.article
      initial={useStaticMotion ? false : { opacity: 0, y: 18 }}
      animate={useStaticMotion ? undefined : { opacity: 1, y: 0 }}
      transition={useStaticMotion ? undefined : { duration: 0.45 }}
      className="relative overflow-hidden rounded-[1.35rem] border-2 border-[#003B7A]/15 bg-white p-6 shadow-[0_16px_48px_-24px_rgba(0,59,122,0.25)] sm:p-8"
    >
      <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-[#009739]/10 blur-[60px]" aria-hidden />

      <div className="relative flex flex-col items-start gap-6 sm:flex-row">
        <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#003B7A]/10 bg-[#FAFBFC] p-3 shadow-sm sm:h-32 sm:w-32">
          <WorkshopLogo
            name={workshop.name}
            logo={workshop.logo}
            variant="hero"
            priority
          />
        </div>

        <div className="space-y-3">
          <span className="inline-flex rounded-full border border-[#009739]/20 bg-[#009739]/8 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#009739]">
            {workshop.category}
          </span>
          <h1 className="text-3xl font-black tracking-tight text-[#003B7A] sm:text-4xl">
            {workshop.name}
          </h1>
        </div>
      </div>
    </motion.article>
  );
}
