import Layout from "@/pages/layout";
import { Link } from "@inertiajs/react";
import { DefaultHead } from "@/pages/components/layout/DefaultHead";
import { ChevronLeft } from "lucide-react";
import { NotFound } from "@/pages/components/NotFound";
import { SponsorHero } from "./components/SponsorHero";
import { AboutPartner } from "./components/AboutPartner";
import { PartnerVideoSection } from "./components/PartnerVideoSection";
import { HighlightsPartner } from "./components/HighlightsPartner";
import { PartnerLocation } from "./components/PartnerLocation";
import { PartnerCTA } from "./components/PartnerCTA";
import { getPartnerStory, isFeaturedSponsor } from "@/pages/partners/services";
import type { PartnerDetailPageComponentProps } from "@/pages/partners/types";

export default function PartnerHomePage({ partner: partnerProp }: PartnerDetailPageComponentProps) {
  const partner = partnerProp ?? null;
  const story = partner ? getPartnerStory(partner) : "";
  const highlights = partner?.highlights ?? [];
  const hasLocation = Boolean(
    partner?.address && partner?.city && partner?.state,
  );
  const isSponsor = partner ? isFeaturedSponsor(partner) : false;
  const entityLabel = isSponsor ? "Patrocinador" : "Parceiro";

  if (!partner) {
    return (
      <NotFound
        title={`${entityLabel} não encontrado`}
        backHref="/parceiros"
        backLabel="Voltar para parceiros"
      />
    );
  }

  return (
    <Layout>
      <DefaultHead
        title={`${partner.name} | ${entityLabel} CAB`}
        description={partner.description}
      />

      <div className="bg-[#FAFBFC]">
        <div className="border-b border-[#003B7A]/8 bg-white/90 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
            <Link
              href="/parceiros"
              className="group inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-[#003B7A]/60 transition-colors hover:text-[#009739]"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Voltar para parceiros
            </Link>
          </div>
        </div>

        <SponsorHero partner={partner} />

        <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6 sm:py-16">
          {story && <AboutPartner description={story} role={partner.role} />}

          {partner.videoUrl && (
            <PartnerVideoSection videoUrl={partner.videoUrl} partnerName={partner.name} />
          )}

          {highlights.length > 0 && <HighlightsPartner highlights={highlights} />}

          {hasLocation && partner.address && partner.city && partner.state && (
            <PartnerLocation
              address={partner.address}
              city={partner.city}
              state={partner.state}
              coordinates={partner.coordinates}
            />
          )}
        </div>

        {partner.website && (
          <div className="border-t border-[#003B7A]/8 bg-white px-4 py-12 sm:px-6 sm:py-16">
            <div className="mx-auto max-w-4xl">
              <PartnerCTA website={partner.website} partnerName={partner.name} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
