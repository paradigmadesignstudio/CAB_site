import type { CTAContent, FAQSectionContent, HeroContent, PageMeta } from "@/types/common";

export interface Plan {
  id?: number;
  key?: string;
  columnLabel?: string;
  name: string;
  description: string;
  basePriceWithFidelity: number;
  basePriceWithoutFidelity: number;
  features: string[];
  ecosystemFeatures: string[];
  href: string;
  popular?: boolean;
  ctaText: string;
}

export interface PlansStaticPlan extends Omit<Plan, "columnLabel"> {}

export interface PlansStaticContent {
  meta?: PageMeta;
  ecosystemPromoPrice: number;
  ecosystemRegularPrice: number;
  hero: HeroContent & { socialProof: string };
  plans: PlansStaticPlan[];
  testimonialsSection: {
    title: string;
    subtitle: string;
    items: Array<{ name: string; text: string; stars: number; initials: string }>;
  };
  comparisonRows: Array<Record<string, string | boolean>>;
  comparisonContent: { title: string; description: string };
  benefitsRows: Array<Record<string, string | boolean>>;
  benefitsContent: { title: string; description: string };
  faqSection: FAQSectionContent;
  finalCta: CTAContent;
}

export interface EcosystemIconFeature {
  icon: string;
  title: string;
  text: string;
}

export interface EcosystemPageContent {
  meta: PageMeta;
  hero: HeroContent;
  raiox: {
    title: string;
    subtitle: string;
    description: string;
    features: EcosystemIconFeature[];
  };
  management: {
    title: string;
    subtitle: string;
    description: string;
    features: EcosystemIconFeature[];
  };
  bentoSection: { title: string; description: string };
  bentoFeatures: Array<{
    colSpan: string;
    icon: string;
    title: string;
    description: string;
  }>;
  finalCTA: CTAContent & {
    badge?: string;
  };
}
