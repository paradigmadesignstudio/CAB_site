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
import { PartnerSearch } from "./components/PartnerSearch";
import { PartnerGrid } from "./components/PartnerGrid";
import { BecomePartnerCTA } from "./components/BecomePartnerCTA";
import { FAQAccordion } from "@/pages/components/FAQAccordion";
import { formatResultsLabel } from "@/lib/formatResultsLabel";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { filterPartners } from "@/pages/partners/services";
import { absoluteUrl, buildFaqPageJsonLd } from "@/lib/seo";
import type { PartnerListPageProps } from "@/pages/partners/types";
import type { SeoSharedProps } from "@/types/seo";

export default function FindPartnerPage({
  pageContent,
  categories,
  partners: partnersProp,
}: PartnerListPageProps) {
  const partners = partnersProp ?? [];
  const showCategoryFilter = partners.some((partner) => Boolean(partner.category));
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 250);
  const debouncedCategory = useDebouncedValue(selectedCategory, 150);
  const { url } = usePage();
  const { appUrl } = usePage<SeoSharedProps>().props;
  const pageUrl = appUrl ? absoluteUrl(appUrl, url.split("?")[0] || "/parceiros") : undefined;
  const faqJsonLd = buildFaqPageJsonLd(pageContent.faq.items, pageUrl) ?? undefined;

  const filteredPartners = useMemo(
    () =>
      filterPartners(
        partners,
        debouncedSearchTerm,
        debouncedCategory === "all" ? null : debouncedCategory,
      ),
    [partners, debouncedSearchTerm, debouncedCategory],
  );

  const isFiltering =
    searchTerm !== debouncedSearchTerm || selectedCategory !== debouncedCategory;

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

        <PremiumZebraBand tone="surface" className="py-10 sm:py-14">
          <PartnerSearch
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            showCategoryFilter={showCategoryFilter}
            categories={categories}
          />
        </PremiumZebraBand>

        <PremiumZebraBand tone="canvas" className="py-10 sm:py-14 lg:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <PremiumSectionHeader
              label="Resultados"
              title={pageContent.listSection.title}
              description={formatResultsLabel(
                pageContent.listSection.resultsLabel,
                filteredPartners.length,
              )}
            />

            {isFiltering && filteredPartners.length > 0 && (
              <p className="mb-4 text-center text-xs text-[#003B7A]/45" aria-live="polite">
                Atualizando resultados…
              </p>
            )}

            {filteredPartners.length > 0 ? (
              <PartnerGrid partners={filteredPartners} />
            ) : (
              <p className="py-12 text-center text-sm text-[#003B7A]/55">
                {pageContent.listSection.emptyMessage}
              </p>
            )}
          </div>
        </PremiumZebraBand>

        <PremiumZebraBand tone="glow" className="py-14 sm:py-16">
          <BecomePartnerCTA
            title={pageContent.becomePartner.title}
            description={pageContent.becomePartner.description}
            buttonText={pageContent.becomePartner.buttonText}
            link={pageContent.becomePartner.link}
          />
        </PremiumZebraBand>

        <FAQSectionBlock content={pageContent.faq}>
          <FAQAccordion items={pageContent.faq.items} />
        </FAQSectionBlock>
      </PremiumPageFrame>
    </Layout>
  );
}
