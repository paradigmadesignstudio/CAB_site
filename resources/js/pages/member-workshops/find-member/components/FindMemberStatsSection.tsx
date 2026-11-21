import { motion } from "framer-motion";
import { useLightMotion } from "@/hooks/useLightMotion";

interface StatsSectionProps {
  stats: { value: string; label: string }[];
}

export function FindMemberStatsSection({ stats }: StatsSectionProps) {
  const useStaticMotion = useLightMotion();

  return (
    <section className="relative overflow-hidden bg-[#003B7A] px-4 py-10 md:py-14">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "4rem 100%",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#009739]/15 blur-[90px]" aria-hidden />

      <div className="relative mx-auto grid max-w-5xl grid-cols-2 gap-4 lg:grid-cols-4 md:gap-5">
        {stats.map((stat, index) => (
          <motion.article
            key={stat.label}
            initial={useStaticMotion ? false : { opacity: 0, y: 18 }}
            whileInView={useStaticMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={useStaticMotion ? undefined : { once: true }}
            transition={useStaticMotion ? undefined : { delay: index * 0.08, duration: 0.45 }}
            className="rounded-[1.35rem] border border-white/35 bg-white/98 p-5 text-center shadow-[0_16px_48px_-24px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-6"
          >
            <p className="text-3xl font-black tabular-nums tracking-tighter text-[#003B7A] md:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-xs font-bold text-[#003B7A]/60 sm:text-sm">{stat.label}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
