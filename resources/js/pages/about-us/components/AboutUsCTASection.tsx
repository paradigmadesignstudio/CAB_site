import { Link } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLightMotion } from "@/hooks/useLightMotion";
import type { AboutCTAContent } from "@/pages/about-us/types";

export function AboutUsCTASection({ data }: { data: AboutCTAContent }) {
  const useStaticMotion = useLightMotion();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      <motion.div
        initial={useStaticMotion ? false : { opacity: 0, y: 16 }}
        whileInView={useStaticMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={useStaticMotion ? undefined : { once: true }}
        className="relative overflow-hidden rounded-[2rem] border-2 border-[#003B7A]/12 bg-gradient-to-br from-[#003B7A] via-[#002952] to-[#081A33] p-8 text-center shadow-[0_24px_60px_-20px_rgba(0,59,122,0.45)] sm:p-12"
      >
        <div
          className="pointer-events-none absolute -right-10 top-0 h-48 w-48 rounded-full bg-[#009739]/25 blur-[60px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-8 left-0 h-40 w-40 rounded-full bg-[#AFFF00]/15 blur-[50px]"
          aria-hidden
        />

        <p className="relative z-10 mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#AFFF00]/80">
          Próximo passo
        </p>
        <h2 className="relative z-10 text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl">
          {data.title}
        </h2>
        <p className="relative z-10 mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
          {data.description}
        </p>

        <div className="relative z-10 mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={data.primaryLink}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#009739] px-8 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_-8px_rgba(0,151,57,0.6)] transition-all hover:-translate-y-0.5 hover:bg-[#00b344] sm:w-auto"
          >
            {data.primaryButton}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={data.secondaryLink}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/15 sm:w-auto"
          >
            {data.secondaryButton}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
