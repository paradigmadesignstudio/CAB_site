import { Deferred, usePage } from "@inertiajs/react"
import { lazy, Suspense } from "react"
import { DefaultHead } from "@/pages/components/layout/DefaultHead"
import Layout from "@/pages/layout"
import { HeroSection } from "@/pages/home/components/hero-section"
import { AgendaSection } from "@/pages/home/components/agenda/AgendaSection"
import { DeferredHomeSection, HomeSectionReveal } from "@/pages/home/components/DeferredHomeSection"
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/seo"
import type { Partner } from "@/pages/partners/types"
import type { AgendaEvent } from "@/types/agenda"
import type { SeoSharedProps } from "@/types/seo"

const FlavorCarousel = lazy(() =>
  import("@/pages/home/components/flavor-carousel").then((m) => ({ default: m.FlavorCarousel })),
)
const BentoGrid = lazy(() =>
  import("@/pages/home/components/bento-grid").then((m) => ({ default: m.BentoGrid })),
)
const ActivationsSection = lazy(() =>
  import("@/pages/home/components/activations-section").then((m) => ({
    default: m.ActivationsSection,
  })),
)
const SocialSection = lazy(() =>
  import("@/pages/home/components/social-section").then((m) => ({ default: m.SocialSection })),
)
const CtaHome = lazy(() =>
  import("@/pages/home/components/cta-home").then((m) => ({ default: m.CtaHome })),
)

interface HomePageProps {
  sponsors?: Partner[] | null;
  agendaEvents?: AgendaEvent[] | null;
}

function SponsorsCarouselFallback() {
  return <div className="min-h-[22rem] bg-[#FAFBFC]" aria-hidden />
}

export default function Home({ sponsors, agendaEvents }: HomePageProps) {
  const { appUrl, siteCompany } = usePage<SeoSharedProps>().props

  const jsonLd =
    appUrl && siteCompany
      ? [
          buildOrganizationJsonLd(siteCompany, appUrl),
          buildWebSiteJsonLd(appUrl, siteCompany.trade_name),
        ]
      : undefined

  return (
    <Layout
      className="bg-white font-sans selection:bg-[#009739]/20"
      mainClassName="overflow-x-hidden"
    >
      <DefaultHead
        title="CAB | Câmbio Automático do Brasil"
        description="Apoio técnico ao reparador: no sistema da CAB ele tira dúvidas sobre transmissões, com material técnico, rede de networking e eventos de estudo e tendências."
        jsonLd={jsonLd}
      />
      <HeroSection />
      <AgendaSection events={agendaEvents} />
      <DeferredHomeSection minHeight="420px">
        <Deferred data="sponsors" fallback={<SponsorsCarouselFallback />}>
          <Suspense fallback={<SponsorsCarouselFallback />}>
            <HomeSectionReveal>
              <FlavorCarousel sponsors={sponsors} />
            </HomeSectionReveal>
          </Suspense>
        </Deferred>
      </DeferredHomeSection>
      <DeferredHomeSection minHeight="520px">
        <Suspense fallback={null}>
          <HomeSectionReveal>
            <BentoGrid />
          </HomeSectionReveal>
        </Suspense>
      </DeferredHomeSection>
      <DeferredHomeSection minHeight="480px">
        <Suspense fallback={null}>
          <HomeSectionReveal>
            <ActivationsSection />
          </HomeSectionReveal>
        </Suspense>
      </DeferredHomeSection>
      <DeferredHomeSection minHeight="560px">
        <Suspense fallback={null}>
          <HomeSectionReveal>
            <SocialSection />
          </HomeSectionReveal>
        </Suspense>
      </DeferredHomeSection>
      <DeferredHomeSection minHeight="320px">
        <Suspense fallback={null}>
          <HomeSectionReveal>
            <CtaHome />
          </HomeSectionReveal>
        </Suspense>
      </DeferredHomeSection>
    </Layout>
  )
}
