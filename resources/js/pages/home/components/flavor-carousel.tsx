import { Link } from "@inertiajs/react"
import { motion } from "framer-motion"
import { ArrowRight, Handshake } from "lucide-react"
import type { Partner } from "@/pages/partners/types"
import { useMediaQuery } from "@/hooks/useMediaQuery"

function PartnerCard({ partner, animated = true }: { partner: Partner; animated?: boolean }) {
  const hotsiteHref = `/parceiros/${partner.slug}`

  const content = (
    <Link
      href={hotsiteHref}
      className="flex h-[22rem] flex-col overflow-hidden rounded-2xl border-2 border-[#003B7A]/15 bg-white no-underline shadow-[0_12px_36px_-16px_rgba(0,59,122,0.28)] transition-[border-color,box-shadow] duration-300 hover:border-[#009739]/35 hover:shadow-[0_20px_48px_-16px_rgba(0,59,122,0.32)] sm:h-[23.5rem]"
    >
      <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#003B7A] via-[#002952] to-[#003B7A] px-4 py-3">
        <Handshake className="h-4 w-4 shrink-0 text-[#AFFF00]" aria-hidden />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">
          Parceiro oficial CAB
        </span>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-5">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(0,151,57,0.08),transparent_65%)]"
          aria-hidden
        />
        <div className="relative flex w-full flex-1 items-center justify-center rounded-xl border border-[#003B7A]/10 bg-[#FAFBFC] px-5 py-6">
          <img
            src={partner.logo}
            alt={partner.name}
            decoding="async"
            loading="lazy"
            className="max-h-[7.25rem] w-full max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.04] sm:max-h-[8rem]"
          />
        </div>

        {partner.partnershipLevel ? (
          <span className="relative mt-4 inline-flex rounded-full border border-[#009739]/25 bg-[#009739]/8 px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#009739]">
            Parceria {partner.partnershipLevel}
          </span>
        ) : (
          <span className="relative mt-4 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#003B7A]/40">
            Rede CAB
          </span>
        )}
      </div>

      <div className="border-t border-[#003B7A]/10 bg-[#FAFBFC] px-5 py-4">
        <span className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#009739] text-sm font-bold text-white shadow-[0_8px_20px_-10px_rgba(0,151,57,0.55)] transition-colors group-hover:bg-[#00b344]">
          Saiba mais
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )

  if (!animated) {
    return (
      <div className="group relative w-[260px] shrink-0 sm:w-[300px]">
        {content}
      </div>
    )
  }

  return (
    <motion.div
      className="group relative w-[260px] shrink-0 sm:w-[300px]"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 200, damping: 28 }}
    >
      {content}
    </motion.div>
  )
}

interface FlavorCarouselProps {
  sponsors?: Partner[] | null;
}

export function FlavorCarousel({ sponsors }: FlavorCarouselProps) {
  const isMobile = useMediaQuery("(max-width: 767px)")

  if (!sponsors?.length) {
    return null
  }

  const duplicatedPartners = isMobile
    ? [...sponsors, ...sponsors]
    : [...sponsors, ...sponsors, ...sponsors]

  return (
    <section id="flavours" className="relative overflow-hidden bg-[#FAFBFC] py-16">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 bg-gradient-to-r from-[#FAFBFC] to-transparent sm:w-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 bg-gradient-to-l from-[#FAFBFC] to-transparent sm:w-20" />

      <div className="relative z-10 mx-auto w-full px-0">
        <div className="mb-12 px-6 text-center">
          <span className="font-mono text-sm font-bold uppercase tracking-[0.28em] text-[#009739] sm:text-base">
            Nossos parceiros
          </span>
          <h2 className="mt-3 text-4xl font-black tracking-tighter text-[#121212] md:text-5xl">
            PARCEIROS DE <span className="text-[#003B7A]">POTÊNCIA</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#121212]/60 sm:text-base">
            Quem caminha ao lado da CAB ajuda a transformar o mercado todos os dias.
          </p>
          <div className="mx-auto mt-4 h-[2px] w-12 rounded-full bg-[#003B7A]" />
        </div>

        <div className="relative flex w-full items-center overflow-hidden">
          {isMobile ? (
            <>
              <style>{`
                @keyframes cab-partners-marquee {
                  from { transform: translate3d(0, 0, 0); }
                  to { transform: translate3d(-50%, 0, 0); }
                }
              `}</style>
              <div
                className="flex w-max gap-5 px-6 pb-6 pt-2 sm:gap-6"
                style={{
                  animation: "cab-partners-marquee 38s linear infinite",
                  willChange: "transform",
                }}
              >
                {duplicatedPartners.map((partner, index) => (
                  <PartnerCard
                    key={`${partner.id}-${index}`}
                    partner={partner}
                    animated={false}
                  />
                ))}
              </div>
            </>
          ) : (
            <motion.div
              className="flex w-max gap-5 px-6 pb-6 pt-2 sm:gap-6"
              animate={{ x: ["0%", "-33.33%"] }}
              transition={{
                ease: "linear",
                duration: 50,
                repeat: Number.POSITIVE_INFINITY,
              }}
            >
              {duplicatedPartners.map((partner, index) => (
                <PartnerCard key={`${partner.id}-${index}`} partner={partner} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
