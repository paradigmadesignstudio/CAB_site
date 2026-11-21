import { PremiumCTABand } from "@/pages/components/premium/PremiumCTABand";

interface BecomeSubscriberCTAProps {
  title: string;
  description: string;
  buttonText: string;
  link: string;
}

export function BecomeSubscriberCTA(props: BecomeSubscriberCTAProps) {
  return <PremiumCTABand eyebrow="Oficinas" {...props} />;
}
