import { motion } from "framer-motion";
import { Building2, ShieldCheck, Users } from "lucide-react";
import { useLightMotion } from "@/hooks/useLightMotion";

const NETWORK_POINTS = [
  {
    icon: Building2,
    title: "Presença na rede",
    description:
      "Marcas patrocinadoras ganham visibilidade junto a centenas de oficinas assinantes da CAB em todo o país.",
  },
  {
    icon: ShieldCheck,
    title: "Confiança do setor",
    description:
      "O selo de patrocinador reforça credibilidade junto a profissionais que buscam fornecedores especializados.",
  },
  {
    icon: Users,
    title: "Conexão com oficineiros",
    description:
      "Aproximação direta com quem repara transmissões automáticas e automatizadas no dia a dia da bancada.",
  },
];

export function SponsorNetworkSection() {
  const useStaticMotion = useLightMotion();

  return (
    <motion.section
      initial={useStaticMotion ? false : { opacity: 0, y: 20 }}
      whileInView={useStaticMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={useStaticMotion ? undefined : { once: true, margin: "-80px" }}
      transition={useStaticMotion ? undefined : { duration: 0.5 }}
      className="relative overflow-hidden rounded-[1.75rem] border border-[#003B7A]/10 bg-gradient-to-br from-white via-[#FAFBFC] to-[#F0F4F8] p-6 shadow-[0_20px_60px_-28px_rgba(0,59,122,0.2)] sm:p-8"
    >
      <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-[#009739]/8 blur-[70px]" aria-hidden />

      <div className="relative mb-8 max-w-2xl">
        <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#009739]">
          Ecossistema CAB
        </p>
        <h2 className="text-2xl font-black tracking-tight text-[#003B7A] sm:text-3xl">
          Uma marca que apoia a evolução do setor
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#003B7A]/65 sm:text-base">
          Os patrocinadores CAB não são apenas fornecedores — são parceiros que investem no
          crescimento técnico e comercial das oficinas especializadas em transmissão automática.
        </p>
      </div>

      <div className="relative grid gap-4 md:grid-cols-3">
        {NETWORK_POINTS.map((point, index) => (
          <motion.article
            key={point.title}
            initial={useStaticMotion ? false : { opacity: 0, y: 16 }}
            whileInView={useStaticMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={useStaticMotion ? undefined : { once: true }}
            transition={useStaticMotion ? undefined : { delay: index * 0.08, duration: 0.45 }}
            className="rounded-[1.25rem] border border-[#003B7A]/8 bg-white/90 p-5"
          >
            <div className="mb-4 inline-flex rounded-xl bg-[#003B7A]/6 p-3 text-[#003B7A]">
              <point.icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-black text-[#003B7A]">{point.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#003B7A]/65">{point.description}</p>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}
