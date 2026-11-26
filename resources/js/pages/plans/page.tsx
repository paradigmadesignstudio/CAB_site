"use client";

import { useMemo, useState } from "react";
import { usePage } from "@inertiajs/react";
import { DefaultHead } from "@/pages/components/layout/DefaultHead";
import Layout from "@/pages/layout";
import { FAQSectionBlock } from "@/pages/components/FAQSectionBlock";
import { PremiumPageFrame, PremiumZebraBand } from "@/pages/components/premium";
import { HeroSection } from "./components/HeroSection";
import { PriceControls } from "./components/PriceControls";
import { PlanCardsGrid } from "./components/PlanCardsGrid";
import { PlansTestimonialsSection } from "./components/PlansTestimonialsSection";
import { ComparisonTable } from "./components/ComparisonTable";
import { BenefitsTable } from "./components/BenefitsTable";
import { TrainingsTable, type TrainingsTableMeta } from "./components/TrainingsTable";
import { FAQAccordion } from "@/pages/components/FAQAccordion";
import { FinalCTA } from "./components/FinalCTA";
import {
  buildIncludedTrainingsBenefitCells,
  formatIncludedTrainingsCount,
  INCLUDED_TRAININGS_BENEFIT_LABEL,
  isIncludedTrainingsBenefitRow,
} from "@/pages/plans/lib/trainingCounts";
import { absoluteUrl, buildFaqPageJsonLd } from "@/lib/seo";
import type { SeoSharedProps } from "@/types/seo";
import type { Plan, PlansStaticContent } from "./types";

interface PlansPageProps {
  staticContent: PlansStaticContent;
  plans?: Plan[] | null;
  trainingsTableMeta?: TrainingsTableMeta | null;
}

function staticPlansFallback(staticContent: PlansStaticContent): Plan[] {
  return staticContent.plans.map((plan) => ({
    name: plan.name,
    description: plan.description,
    basePriceWithFidelity: plan.basePriceWithFidelity,
    basePriceWithoutFidelity: plan.basePriceWithoutFidelity,
    features: plan.features,
    ecosystemFeatures: plan.ecosystemFeatures,
    href: plan.href,
    popular: plan.popular,
    ctaText: plan.ctaText,
    columnLabel: plan.name.replace(/^Plataforma\s+/i, ""),
  }));
}

export default function PlansPage({
  staticContent,
  plans: plansProp,
  trainingsTableMeta,
}: PlansPageProps) {
  const [withFidelity, setWithFidelity] = useState(true);
  const [withEcosystem, setWithEcosystem] = useState(false);

  const activePlans = useMemo(
    () => (plansProp && plansProp.length > 0 ? plansProp : staticPlansFallback(staticContent)),
    [plansProp, staticContent],
  );

  const prices = useMemo(() => {
    const result: Record<string, number> = {};

    activePlans.forEach((plan) => {
      const base = withFidelity ? plan.basePriceWithFidelity : plan.basePriceWithoutFidelity;
      result[plan.name] =
        base + (withEcosystem ? staticContent.ecosystemPromoPrice : 0);
      result[`${plan.name}_regular`] =
        base + (withEcosystem ? staticContent.ecosystemRegularPrice : 0);
    });

    return result;
  }, [activePlans, staticContent.ecosystemPromoPrice, staticContent.ecosystemRegularPrice, withEcosystem, withFidelity]);

  const plansWithPopular = activePlans.map((plan) => ({
    ...plan,
    popular: plan.popular ?? false,
  }));

  const plansForCards = useMemo(() => {
    const premiumCount = trainingsTableMeta?.planSummary?.[2]?.count;

    if (!premiumCount) {
      return plansWithPopular;
    }

    const label = formatIncludedTrainingsCount(premiumCount, true);

    return plansWithPopular.map((plan) => ({
      ...plan,
      features: plan.features.map((feature) =>
        /cursos de c[aâ]mbios/i.test(feature) ? label : feature,
      ),
    }));
  }, [plansWithPopular, trainingsTableMeta?.planSummary]);

  const benefitsRows = useMemo(() => {
    const dynamicCells = trainingsTableMeta?.planSummary
      ? buildIncludedTrainingsBenefitCells(trainingsTableMeta.planSummary)
      : null;

    return staticContent.benefitsRows.map((row) => {
      if (!isIncludedTrainingsBenefitRow(String(row.label))) {
        return row;
      }

      if (!dynamicCells) {
        return { ...row, label: INCLUDED_TRAININGS_BENEFIT_LABEL };
      }

      return {
        ...row,
        label: INCLUDED_TRAININGS_BENEFIT_LABEL,
        p1: dynamicCells.p1,
        p2: dynamicCells.p2,
        p3: dynamicCells.p3,
      };
    });
  }, [staticContent.benefitsRows, trainingsTableMeta?.planSummary]);

  const { url } = usePage();
  const { appUrl } = usePage<SeoSharedProps>().props;
  const pageUrl = appUrl ? absoluteUrl(appUrl, url.split("?")[0] || "/planos") : undefined;
  const faqJsonLd = buildFaqPageJsonLd(staticContent.faqSection.items, pageUrl) ?? undefined;

  return (
    <Layout>
      <DefaultHead
        title={staticContent.meta?.title || "Planos CAB | Treinamento e suporte para oficinas de câmbio"}
        description={
          staticContent.meta?.description ||
          "No sistema CAB o reparador tira as principais dúvidas sobre transmissões, com material técnico, rede de apoio e eventos de estudo do mercado."
        }
        jsonLd={faqJsonLd}
      />

      <PremiumPageFrame>
        <PremiumZebraBand tone="canvas" className="py-0">
          <HeroSection
            badge={staticContent.hero.badge}
            title={staticContent.hero.title}
            description={staticContent.hero.description}
            socialProof={staticContent.hero.socialProof}
          />
        </PremiumZebraBand>

        <PremiumZebraBand tone="navy" className="py-0">
          <PriceControls
            withFidelity={withFidelity}
            setWithFidelity={setWithFidelity}
            withEcosystem={withEcosystem}
            setWithEcosystem={setWithEcosystem}
            ecosystemPromoPrice={staticContent.ecosystemPromoPrice}
          />
          <PlanCardsGrid
            plans={plansForCards}
            prices={prices}
            withEcosystem={withEcosystem}
            withFidelity={withFidelity}
          />
        </PremiumZebraBand>

        <PremiumZebraBand tone="surface" className="py-10 sm:py-14 lg:py-16">
          <PlansTestimonialsSection
            title={staticContent.testimonialsSection.title}
            subtitle={staticContent.testimonialsSection.subtitle}
            items={staticContent.testimonialsSection.items}
          />
        </PremiumZebraBand>

        <PremiumZebraBand tone="navy" className="py-0">
          <BenefitsTable
            title={staticContent.benefitsContent.title}
            description={staticContent.benefitsContent.description}
            rows={benefitsRows}
            plans={plansWithPopular}
          />
        </PremiumZebraBand>

        <PremiumZebraBand tone="canvas" className="py-10 sm:py-14 lg:py-16">
          <ComparisonTable
            title={staticContent.comparisonContent.title}
            description={staticContent.comparisonContent.description}
            rows={staticContent.comparisonRows}
            plans={plansWithPopular}
          />
        </PremiumZebraBand>

        <PremiumZebraBand tone="navy" className="py-0">
          {trainingsTableMeta && (
            <TrainingsTable
              title={trainingsTableMeta.title}
              description={trainingsTableMeta.description}
              planSummary={trainingsTableMeta.planSummary}
              totalCount={trainingsTableMeta.totalCount}
              plans={plansWithPopular}
            />
          )}
        </PremiumZebraBand>

        <FAQSectionBlock content={staticContent.faqSection}>
          <FAQAccordion items={staticContent.faqSection.items} />

          <FinalCTA
            title={staticContent.finalCta.title}
            description={staticContent.finalCta.description}
            buttonText={staticContent.finalCta.buttonText}
            link={staticContent.finalCta.link}
          />
        </FAQSectionBlock>
      </PremiumPageFrame>
    </Layout>
  );
}
