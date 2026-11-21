import { motion } from "framer-motion";
import { PremiumSectionHeader } from "@/pages/components/premium";
import { ArticlesSlider } from "@/pages/blog/components/ArticlesSlider";
import type { Columnist } from "@/pages/blog/types";

interface ColumnistSectionProps {
  columnist: Columnist;
  index: number;
}

export function ColumnistSection({ columnist, index }: ColumnistSectionProps) {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-start gap-8 rounded-[1.35rem] border-2 border-[#003B7A]/12 bg-white p-6 shadow-[0_12px_40px_-16px_rgba(0,59,122,0.2)] md:flex-row md:p-10"
      >
        <div className="shrink-0">
          <img
            src={columnist.avatar}
            alt={columnist.name}
            className="h-28 w-28 rounded-2xl border-2 border-[#003B7A]/15 object-cover shadow-[0_8px_30px_-14px_rgba(0,59,122,0.2)] md:h-36 md:w-36"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </div>

        <div className="flex-1">
          <span className="mb-2 inline-flex rounded-full border border-[#009739]/20 bg-[#009739]/8 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#009739]">
            {columnist.role}
          </span>
          <h3 className="mb-4 text-2xl font-black text-[#003B7A]">{columnist.name}</h3>
          <p className="text-base leading-relaxed text-[#003B7A]/70">{columnist.bio}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-10"
      >
        <PremiumSectionHeader
          label="Publicações"
          title={`Artigos de ${columnist.name.split(" ")[0]}`}
        />
        <ArticlesSlider articles={columnist.articles} isEven={index % 2 !== 0} premium />
      </motion.div>
    </div>
  );
}
