import { motion } from "framer-motion";
import { ArrowUpRight, Crown, Handshake, Sparkles } from "lucide-react";
import { useLightMotion } from "@/hooks/useLightMotion";
import { getPartnerShortDescription, isFeaturedSponsor } from "@/pages/partners/services";
import { safeHttpUrl } from "@/lib/safeUrl";
import { CmsResponsiveImage } from "@/pages/components/CmsResponsiveImage";
import type { Partner } from "@/pages/partners/types";

interface SponsorHeroProps {
  partner: Partner;
}

export function SponsorHero({ partner }: SponsorHeroProps) {
  const useStaticMotion = useLightMotion();
  const shortDescription = getPartnerShortDescription(partner);
  const website = safeHttpUrl(partner.website);
  const isSponsor = isFeaturedSponsor(partner);

  return (
    <section className="relative overflow-hidden bg-[#003B7A] pb-16 pt-8 sm:pb-20 sm:pt-10">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "4rem 100%",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#009739]/20 blur-[100px]" aria-hidden />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-[#AFFF00]/10 blur-[90px]" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={useStaticMotion ? false : { opacity: 0, y: 24 }}
          animate={useStaticMotion ? undefined : { opacity: 1, y: 0 }}
          transition={useStaticMotion ? undefined : { duration: 0.55 }}
          className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14"
        >
          <div className="order-2 space-y-6 lg:order-1">
            <div className="flex flex-wrap items-center gap-3">
              {isSponsor ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-[#AFFF00]/30 bg-[#AFFF00]/12 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#AFFF00]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Patrocinador oficial
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-white/85">
                  <Handshake className="h-3.5 w-3.5" />
                  Parceiro CAB
                </span>
              )}
              {partner.partnershipLevel && (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/75">
                  Nível {partner.partnershipLevel}
                </span>
              )}
            </div>

            <div>
              <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white/45">
                {isSponsor ? "Marca patrocinadora da rede CAB" : "Marca parceira da rede CAB"}
              </p>
              <h1 className="text-4xl font-black leading-[0.95] tracking-tight text-white sm:text-5xl md:text-6xl">
                {partner.name}
              </h1>
            </div>

            {shortDescription && (
              <p className="max-w-xl text-base leading-relaxed text-white/72 sm:text-lg">
                {shortDescription}
              </p>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#009739] px-6 text-sm font-bold text-white shadow-[0_12px_32px_-12px_rgba(0,151,57,0.65)] transition-all hover:-translate-y-0.5 hover:bg-[#00b344]"
                >
                  Visitar site oficial
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          <motion.div
            initial={useStaticMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={useStaticMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={useStaticMotion ? undefined : { delay: 0.12, duration: 0.55 }}
            className="order-1 lg:order-2"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[#AFFF00]/20 via-transparent to-[#009739]/20 blur-2xl" aria-hidden />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white p-8 shadow-[0_32px_80px_-24px_rgba(0,0,0,0.55)] sm:p-10 md:p-12">
                <div className="mb-6 flex items-center justify-between gap-4 border-b border-[#003B7A]/10 pb-5">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#003B7A]/45">
                    Logo oficial
                  </span>
                  <span
                    className={
                      isSponsor
                        ? "inline-flex items-center gap-1.5 rounded-full bg-[#F5C542]/15 px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#9A6B08]"
                        : "rounded-full bg-[#003B7A]/8 px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#003B7A]/70"
                    }
                  >
                    {isSponsor && <Crown className="h-3 w-3" />}
                    {isSponsor ? "Patrocinador" : "Parceiro"}
                  </span>
                </div>
                <div className="relative flex min-h-[220px] items-center justify-center rounded-[1.35rem] border border-[#003B7A]/8 bg-[#FAFBFC] p-8 sm:min-h-[260px]">
                  {isSponsor && (
                    <span
                      className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#F5C542] to-[#D4920D] shadow-[0_10px_24px_-10px_rgba(212,146,13,0.85)] ring-2 ring-white"
                      aria-hidden
                    >
                      <Crown className="h-4 w-4 text-white" strokeWidth={2.25} />
                    </span>
                  )}
                  <CmsResponsiveImage
                    image={partner.logo}
                    mobileImage={partner.logoMobile}
                    alt={partner.name}
                    pictureClassName="flex max-h-44 w-full max-w-full items-center justify-center sm:max-h-52"
                    imageClassName="max-h-44 w-full max-w-full object-contain sm:max-h-52"
                    decoding="async"
                    fetchPriority="high"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
