import { useMemo } from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import DOMPurify from "dompurify";
import { useLightMotion } from "@/hooks/useLightMotion";
import type { Partner } from "@/pages/partners/types";

interface AboutPartnerProps {
  description: string;
  role?: Partner["role"];
}

export function AboutPartner({ description, role = "partner" }: AboutPartnerProps) {
  const useStaticMotion = useLightMotion();
  const sanitizedContent = useMemo(() => DOMPurify.sanitize(description), [description]);
  const isSponsor = role === "sponsor";

  return (
    <motion.section
      initial={useStaticMotion ? false : { opacity: 0, y: 20 }}
      whileInView={useStaticMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={useStaticMotion ? undefined : { once: true, margin: "-100px" }}
      transition={useStaticMotion ? undefined : { duration: 0.5 }}
      className="relative overflow-hidden rounded-[1.75rem] border border-[#003B7A]/10 bg-white p-6 shadow-[0_16px_48px_-24px_rgba(0,59,122,0.18)] sm:p-8"
    >
      <div className="pointer-events-none absolute -left-8 top-0 h-32 w-32 rounded-full bg-[#AFFF00]/10 blur-[60px]" aria-hidden />

      <div className="relative mb-6 flex items-start gap-4">
        <div className="rounded-2xl bg-[#003B7A]/6 p-3 text-[#003B7A]">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#009739]">
            {isSponsor ? "Sobre o patrocinador" : "Sobre o parceiro"}
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-[#003B7A] sm:text-3xl">
            {isSponsor ? "História da marca patrocinadora" : "História da marca parceira"}
          </h2>
        </div>
      </div>

      <article
        className="prose prose-sm max-w-none sm:prose-base prose-headings:font-black prose-headings:text-[#003B7A] prose-p:text-[#003B7A]/75 prose-a:text-[#009739] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#003B7A] prose-img:rounded-2xl prose-img:border prose-img:border-[#003B7A]/10"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </motion.section>
  );
}
