import { PremiumHeroHeader } from "@/pages/components/premium";

interface HeroSectionProps {
  badge: string;
  title: React.ReactNode;
  description: string;
  socialProof: string;
}

export function HeroSection({ badge, title, description, socialProof }: HeroSectionProps) {
  return (
    <PremiumHeroHeader
      badge={badge}
      title={title}
      description={description}
      footer={
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#003B7A]/45">
          {socialProof}
        </p>
      }
    />
  );
}
