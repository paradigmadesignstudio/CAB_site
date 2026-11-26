import type { CTAContent, FAQSectionContent, HeroContent, PageMeta } from "@/types/common";
import type { TrainingsTableMeta } from "@/pages/plans/components/TrainingsTable";
import type { TrainingGroup } from "@/pages/plans/components/training-types";

export interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  level: "Iniciante" | "Intermediário" | "Avançado";
  price: string;
  originalPrice?: string;
  image: string;
  imageMobile?: string | null;
  link: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  avatar?: string;
}

export interface Material {
  id: number;
  slug: string;
  title: string;
  description: string;
  image?: string;
  imageMobile?: string | null;
  /** Só disponível após POST de lead; não vem na carga da página. */
  downloadUrl?: string;
}

export interface AcademyBenefit {
  icon: string;
  title: string;
  description: string;
}

export interface AcademyHeroContent extends HeroContent {
  titleHighlight: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

export interface AcademyTrainingsSectionContent {
  label: string;
  title: string;
  titleHighlight: string;
  description: string;
  evolutionNote?: {
    title: string;
    description: string;
  };
  featuredCount: number;
  catalog: {
    title: string;
    description: string;
    searchPlaceholder: string;
    emptyResults: string;
  };
  cta: {
    label: string;
    href: string;
  };
}

export interface AcademyPlatformMaterialCard {
  id: number;
  title: string;
  image: string;
  imageMobile?: string | null;
  category: string;
  categoryId: number;
  link: string;
}

export interface AcademyPlatformMaterialCategory {
  id: number;
  name: string;
  materials: AcademyPlatformMaterialCard[];
}

export interface AcademyPlatformMaterialsSectionContent {
  label: string;
  title: string;
  titleHighlight: string;
  description: string;
  featuredCount: number;
  exclusiveBadge: string;
  catalog: {
    title: string;
    description: string;
    searchPlaceholder: string;
    emptyResults: string;
  };
  cta: {
    label: string;
    href: string;
  };
}

export interface AcademyPlatformMaterialsSectionData {
  meta: {
    totalCount: number;
    categoryCount: number;
  };
  featured: AcademyPlatformMaterialCard[];
  categories: AcademyPlatformMaterialCategory[];
}

export interface AcademyPageContent {
  meta: PageMeta;
  hero: AcademyHeroContent;
  platformMaterialsSection: AcademyPlatformMaterialsSectionContent;
  trainingsSection: AcademyTrainingsSectionContent;
  benefitsSection: {
    title: string;
    titleHighlight: string;
    description: string;
    items: AcademyBenefit[];
  };
  cta: CTAContent;
  faq: FAQSectionContent;
}

export interface AcademyTrainingsSectionData {
  meta: TrainingsTableMeta;
  groups: TrainingGroup[];
}

export interface AcademyPageProps {
  pageContent: AcademyPageContent;
  materials?: Material[];
  courses?: Course[];
  testimonials?: Testimonial[];
  platformMaterialsSectionData?: AcademyPlatformMaterialsSectionData | null;
  platformMaterialCategories?: AcademyPlatformMaterialsSectionData["categories"];
  trainingsSectionData?: AcademyTrainingsSectionData | null;
}
