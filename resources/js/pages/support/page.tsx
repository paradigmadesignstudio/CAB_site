import { DefaultHead } from "@/pages/components/layout/DefaultHead";
import Layout from "@/pages/layout";
import { usePage } from "@inertiajs/react";
import { PremiumPageFrame, PremiumZebraBand } from "@/pages/components/premium";
import { HeroContact } from "./components/HeroContact";
import { ContactCardsSection } from "./components/ContactCardsSection";
import { ContactFormSection } from "./components/ContactFormSection";
import { MapSection } from "./components/MapSection";
import { FAQAccordion } from "@/pages/components/FAQAccordion";
import { FAQSectionBlock } from "@/pages/components/FAQSectionBlock";
import { ContactCTASection } from "./components/ContactCTASection";
import { absoluteUrl, buildFaqPageJsonLd } from "@/lib/seo";
import type { SeoSharedProps } from "@/types/seo";
import type { SupportPageProps } from "./types";

export default function SupportPage({ pageContent, contactInfo }: SupportPageProps) {
  const { url } = usePage();
  const { appUrl } = usePage<SeoSharedProps>().props;
  const pageUrl = appUrl ? absoluteUrl(appUrl, url.split("?")[0] || "/suporte") : undefined;
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
          <HeroContact />
        </PremiumZebraBand>

        <PremiumZebraBand tone="navy" className="py-10 md:py-14">
          <ContactCardsSection info={contactInfo} />
        </PremiumZebraBand>

        <PremiumZebraBand tone="surface" className="py-10 sm:py-14">
          <ContactFormSection />
        </PremiumZebraBand>

        <PremiumZebraBand tone="canvas" className="py-0">
          <MapSection />
        </PremiumZebraBand>

        <PremiumZebraBand tone="glow" className="py-10 sm:py-14">
          <ContactCTASection />
        </PremiumZebraBand>

        <FAQSectionBlock content={pageContent.faq}>
          <FAQAccordion items={pageContent.faq.items} />
        </FAQSectionBlock>
      </PremiumPageFrame>
    </Layout>
  );
}
