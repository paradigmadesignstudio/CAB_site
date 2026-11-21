import { PremiumCTABand } from "@/pages/components/premium/PremiumCTABand";
import type { CTAContent } from "@/types/common";

interface CTASectionProps {
  content: CTAContent;
}

export function AcademyCTASection({ content }: CTASectionProps) {
  return (
    <PremiumCTABand
      eyebrow="Academia CAB"
      title={content.title}
      description={content.description}
      buttonText={content.buttonText}
      link={content.link}
      externalLink
    />
  );
}
