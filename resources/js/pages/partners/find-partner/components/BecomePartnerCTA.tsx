import { PremiumCTABand } from "@/pages/components/premium/PremiumCTABand";

interface BecomePartnerCTAProps {
  title: string;
  description: string;
  buttonText: string;
  link: string;
}

export function BecomePartnerCTA(props: BecomePartnerCTAProps) {
  return <PremiumCTABand eyebrow="Rede CAB" {...props} />;
}
