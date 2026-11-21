import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useLightMotion } from "@/hooks/useLightMotion";

interface HighlightsPartnerProps {
  highlights: string[];
}

export function HighlightsPartner({ highlights }: HighlightsPartnerProps) {
  const useStaticMotion = useLightMotion();

  if (!highlights || highlights.length === 0) return null;

  return (
    <motion.section
      initial={useStaticMotion ? false : { opacity: 0, y: 20 }}
      whileInView={useStaticMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={useStaticMotion ? undefined : { once: true, margin: "-100px" }}
      transition={useStaticMotion ? undefined : { duration: 0.5 }}
    >
      <div className="mb-6">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#009739]">
          Diferenciais
        </p>
        <h2 className="mt-1 text-2xl font-black tracking-tight text-[#003B7A] sm:text-3xl">
          O que destaca esta marca
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((highlight) => (
          <div
            key={highlight}
            className="flex items-start gap-3 rounded-[1.25rem] border border-[#003B7A]/10 bg-white p-5 shadow-[0_10px_30px_-16px_rgba(0,59,122,0.15)] transition-colors hover:border-[#009739]/25"
          >
            <div className="rounded-xl bg-[#AFFF00]/15 p-2 text-[#003B7A]">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-medium leading-relaxed text-[#003B7A]/80">{highlight}</span>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
