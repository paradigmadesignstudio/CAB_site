import type { LucideIcon } from "lucide-react";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface HeroContent {
  badge: string;
  title: string;
  description: string;
}

export interface StatItem {
  value: string;
  label: string;
  delay?: number;
}

export interface CTAContent {
  title: string;
  description: string;
  buttonText: string;
  link: string;
}

export interface PageMeta {
  title: string;
  description?: string;
}

export interface FAQSectionContent {
  title: string;
  items: FAQItem[];
}

export interface ListSectionContent {
  title: string;
  emptyMessage: string;
  resultsLabel: string;
}

export interface EntityWithSlug {
  slug: string;
}

export interface IconFeature {
  icon: LucideIcon;
  title: string;
  text: string;
}
