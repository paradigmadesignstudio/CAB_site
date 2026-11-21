"use client";

import { useMemo, useState } from "react";
import { usePage } from "@inertiajs/react";
import { DefaultHead } from "@/pages/components/layout/DefaultHead";
import Layout from "@/pages/layout";
import { FAQSectionBlock } from "@/pages/components/FAQSectionBlock";
import {
  PremiumPageFrame,
  PremiumSectionHeader,
  PremiumZebraBand,
} from "@/pages/components/premium";
import { HeroSection } from "./components/HeroSection";
import { FindMemberStatsSection } from "./components/FindMemberStatsSection";
import { SearchSection } from "./components/SearchSection";
import { WorkshopsGrid } from "./components/WorkshopsGrid";
import { BecomeSubscriberCTA } from "./components/BecomeSubscriberCTA";
import { Disclaimer } from "./components/Disclaimer";
import { FAQAccordion } from "@/pages/components/FAQAccordion";
import { CollapsibleMap } from "./components/CollapsibleMap";
import { formatResultsLabel } from "@/lib/formatResultsLabel";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { filterWorkshops } from "@/pages/member-workshops/services";
import { absoluteUrl, buildFaqPageJsonLd } from "@/lib/seo";
import type { WorkshopListPageProps } from "@/pages/member-workshops/types";
import type { SeoSharedProps } from "@/types/seo";

export default function FindMemberPage({
  pageContent,
  brazilStates,
  workshops: workshopsProp,
}: WorkshopListPageProps) {
  const workshops = workshopsProp ?? [];
  const [selectedState, setSelectedState] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 250);
  const debouncedState = useDebouncedValue(selectedState, 150);
  const { url } = usePage();
  const { appUrl } = usePage<SeoSharedProps>().props;
  const pageUrl = appUrl ? absoluteUrl(appUrl, url.split("?")[0] || "/oficinas") : undefined;
  const faqJsonLd = buildFaqPageJsonLd(pageContent.faq.items, pageUrl) ?? undefined;

  const filteredWorkshops = useMemo(
    () => filterWorkshops(workshops, debouncedState, debouncedSearchTerm),
    [workshops, debouncedState, debouncedSearchTerm],
  );

  const isFiltering =
    searchTerm !== debouncedSearchTerm || selectedState !== debouncedState;

  return (
    <Layout>
      <DefaultHead
        title={pageContent.meta.title}
        description={pageContent.meta.description}
        jsonLd={faqJsonLd}
      />

      <PremiumPageFrame>
        <PremiumZebraBand tone="canvas" className="py-0">
          <HeroSection
            badge={pageContent.hero.badge}
            title={pageContent.hero.title}
            description={pageContent.hero.description}
          />
        </PremiumZebraBand>

        <FindMemberStatsSection stats={pageContent.stats} />

        <PremiumZebraBand tone="surface" className="py-10 sm:py-14">
          <SearchSection
            selectedState={selectedState}
            onStateChange={setSelectedState}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            brazilStates={brazilStates}
          />
        </PremiumZebraBand>

        <PremiumZebraBand tone="canvas" className="py-10 sm:py-14 lg:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <CollapsibleMap workshops={filteredWorkshops} />

            <div className="mt-10">
              <PremiumSectionHeader
                label="Resultados"
                title={pageContent.listSection.title}
                description={formatResultsLabel(
                  pageContent.listSection.resultsLabel,
                  filteredWorkshops.length,
                )}
              />

              {isFiltering && filteredWorkshops.length > 0 && (
                <p className="mb-4 text-center text-xs text-[#003B7A]/45" aria-live="polite">
                  Atualizando resultados…
                </p>
              )}

              {filteredWorkshops.length > 0 ? (
                <WorkshopsGrid workshops={filteredWorkshops} />
              ) : (
                <p className="py-12 text-center text-sm text-[#003B7A]/55">
                  {pageContent.listSection.emptyMessage}
                </p>
              )}
            </div>
          </div>
        </PremiumZebraBand>

        <PremiumZebraBand tone="glow" className="py-14 sm:py-16">
          <BecomeSubscriberCTA
            title={pageContent.becomeAssociate.title}
            description={pageContent.becomeAssociate.description}
            buttonText={pageContent.becomeAssociate.buttonText}
            link={pageContent.becomeAssociate.link}
          />
        </PremiumZebraBand>

        <PremiumZebraBand tone="surface" className="py-10 sm:py-12">
          <Disclaimer text={pageContent.disclaimer} />
        </PremiumZebraBand>

        <FAQSectionBlock content={pageContent.faq}>
          <FAQAccordion items={pageContent.faq.items} />
        </FAQSectionBlock>
      </PremiumPageFrame>
    </Layout>
  );
}
