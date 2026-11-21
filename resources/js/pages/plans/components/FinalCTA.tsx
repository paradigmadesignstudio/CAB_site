import { PremiumCTABand } from "@/pages/components/premium/PremiumCTABand";

interface FinalCTAProps {
  title: string;
  description: string;
  buttonText: string;
  link: string;
}

export function FinalCTA({ link, ...props }: FinalCTAProps) {
  const isExternal =
    link.startsWith("http://") || link.startsWith("https://");

  return (
    <PremiumCTABand
      eyebrow="Assine"
      bandClassName="mt-16 sm:mt-20"
      centered={false}
      link={link}
      externalLink={isExternal}
      {...props}
    />
  );
}
