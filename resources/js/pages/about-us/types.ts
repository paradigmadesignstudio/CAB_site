import type { HeroContent, PageMeta, StatItem } from "@/types/common";

export interface AboutHeroContent extends HeroContent {
  titleStart: string;
  titleHighlight: string;
  titleEnd: string;
}

export interface AboutTimelineItem {
  year: string;
  title: string;
  description: string;
  icon: string;
}

export interface AboutPillar {
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}

export interface AboutTeamMember {
  name: string;
  role: string;
  image: string;
}

export interface AboutCTAContent {
  title: string;
  description: string;
  primaryButton: string;
  primaryLink: string;
  secondaryButton: string;
  secondaryLink: string;
}

export interface AboutUsPageContent {
  meta: PageMeta;
  hero: AboutHeroContent;
  stats: StatItem[];
  cta: AboutCTAContent;
}
