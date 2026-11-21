import { PremiumHeroHeader } from "@/pages/components/premium/PremiumHeroHeader";

interface HeroSectionProps {
  badge: string;
  title: string;
  description: string;
}

export function HeroSection({ badge, title, description }: HeroSectionProps) {
  return <PremiumHeroHeader badge={badge} title={title} description={description} />;
}
