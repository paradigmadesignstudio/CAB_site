import { PremiumCTABand } from "@/pages/components/premium/PremiumCTABand";

export function ContactCTASection() {
  return (
    <PremiumCTABand
      eyebrow="Parceria CAB"
      title="Quer ser um parceiro CAB?"
      description="Junte-se à maior rede de especialistas em câmbio automático do Brasil e tenha acesso a benefícios exclusivos."
      buttonText="Ver planos"
      link="/planos"
      externalLink
    />
  );
}
