import { Crown } from "lucide-react";
import { safeHttpUrl } from "@/lib/safeUrl";
import { getPartnerShortDescription, isFeaturedSponsor } from "@/pages/partners/services";
import { DirectoryEntityCard } from "@/pages/components/directory/DirectoryEntityCard";
import type { Partner } from "@/pages/partners/types";

interface PartnerCardProps {
  partner: Partner;
  index?: number;
}

export function PartnerCard({ partner, index = 0 }: PartnerCardProps) {
  const shortDescription = getPartnerShortDescription(partner);
  const isSponsor = isFeaturedSponsor(partner);

  return (
    <DirectoryEntityCard
      name={partner.name}
      logo={partner.logo}
      detailHref={`/parceiros/${partner.slug}`}
      detailLabel="Saiba mais"
      externalHref={safeHttpUrl(partner.website)}
      index={index}
      titleClassName="break-words"
      logoBadge={
        isSponsor ? (
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#F5C542] to-[#D4920D] shadow-[0_8px_20px_-8px_rgba(212,146,13,0.8)] ring-2 ring-white"
            title="Patrocinador em destaque"
            aria-label="Patrocinador em destaque"
          >
            <Crown className="h-4 w-4 text-white" strokeWidth={2.25} />
          </span>
        ) : undefined
      }
      badge={
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span
            className={
              isSponsor
                ? "rounded-full border border-[#D4920D]/25 bg-[#F5C542]/12 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#9A6B08]"
                : "rounded-full border border-[#003B7A]/12 bg-[#003B7A]/6 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#003B7A]/70"
            }
          >
            {isSponsor ? "Patrocinador" : "Parceiro"}
          </span>
          {partner.category ? (
            <span className="rounded-full border border-[#009739]/20 bg-[#009739]/8 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#009739]">
              {partner.category}
            </span>
          ) : null}
        </div>
      }
      body={
        shortDescription ? (
          <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-[#003B7A]/65">{shortDescription}</p>
        ) : undefined
      }
    />
  );
}
