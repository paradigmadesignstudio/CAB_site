import { Deferred, usePage } from "@inertiajs/react";
import Layout from "@/pages/layout";
import { DefaultHead } from "@/pages/components/layout/DefaultHead";
import { PremiumPageFrame, PremiumZebraBand } from "@/pages/components/premium";
import { HeroAcademia } from "@/pages/academy/components/HeroAcademia";
import { FreeMaterialsCarousel } from "@/pages/academy/components/FreeMaterialsCarousel";
import { BenefitsCardsSection } from "@/pages/academy/components/BenefitsCardSection";
import { AcademyTestimonialsSection } from "@/pages/academy/components/AcademyTestimonialsSection";
import { AcademyCTASection } from "@/pages/academy/components/AcademyCTASection";
import { AcademyPlatformMaterialsSection } from "@/pages/academy/components/AcademyPlatformMaterialsSection";
import { AcademyTrainingsSection } from "@/pages/academy/components/AcademyTrainingsSection";
import { FAQAccordion } from "@/pages/components/FAQAccordion";
import { FAQSectionBlock } from "@/pages/components/FAQSectionBlock";
import { absoluteUrl, buildFaqPageJsonLd } from "@/lib/seo";
import type { SeoSharedProps } from "@/types/seo";
import type { AcademyPageProps } from "./types";

export default function AcademyPage({
  pageContent,
  materials = [],
  testimonials = [],
  platformMaterialsSectionData,
  platformMaterialCategories,
  trainingsSectionData,
}: AcademyPageProps) {
  const { url } = usePage();
  const { appUrl } = usePage<SeoSharedProps>().props;
  const pageUrl = appUrl ? absoluteUrl(appUrl, url.split("?")[0] || "/academia-cab") : undefined;
  const faqJsonLd = buildFaqPageJsonLd(pageContent.faq.items, pageUrl) ?? undefined;

  return (
    <Layout>
      <DefaultHead
        title={pageContent.meta.title}
        description={pageContent.meta.description}
        jsonLd={faqJsonLd}
      />

      <PremiumPageFrame>
        <PremiumZebraBand tone="canvas" className="py-0">
          <HeroAcademia content={pageContent.hero} />
        </PremiumZebraBand>

        <PremiumZebraBand tone="surface" className="py-10 sm:py-14">
          <FreeMaterialsCarousel materials={materials} />
        </PremiumZebraBand>

        <PremiumZebraBand tone="canvas" className="py-0">
          {platformMaterialsSectionData && platformMaterialsSectionData.featured.length > 0 && (
            <Deferred
              data="platformMaterialCategories"
              fallback={
                <AcademyPlatformMaterialsSection
                  content={pageContent.platformMaterialsSection}
                  meta={platformMaterialsSectionData.meta}
                  featured={platformMaterialsSectionData.featured}
                  categories={[]}
                />
              }
            >
              <AcademyPlatformMaterialsSection
                content={pageContent.platformMaterialsSection}
                meta={platformMaterialsSectionData.meta}
                featured={platformMaterialsSectionData.featured}
                categories={platformMaterialCategories ?? []}
              />
            </Deferred>
          )}
        </PremiumZebraBand>

        <PremiumZebraBand tone="surface" className="py-0">
          {trainingsSectionData && trainingsSectionData.groups.length > 0 && (
            <AcademyTrainingsSection
              content={pageContent.trainingsSection}
              meta={trainingsSectionData.meta}
              groups={trainingsSectionData.groups}
            />
          )}
        </PremiumZebraBand>

        <PremiumZebraBand tone="glow" className="py-10 sm:py-14">
          <AcademyTestimonialsSection testimonials={testimonials} />
        </PremiumZebraBand>

        <PremiumZebraBand tone="canvas" className="py-10 sm:py-14">
          <BenefitsCardsSection content={pageContent.benefitsSection} />
        </PremiumZebraBand>

        <PremiumZebraBand tone="surface" className="py-10 sm:py-14">
          <AcademyCTASection content={pageContent.cta} />
        </PremiumZebraBand>

        <FAQSectionBlock content={pageContent.faq}>
          <FAQAccordion items={pageContent.faq.items} />
        </FAQSectionBlock>
      </PremiumPageFrame>
    </Layout>
  );
}
