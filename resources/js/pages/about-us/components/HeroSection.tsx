import { PremiumHeroHeader } from "@/pages/components/premium";

export function HeroSection({ data }: { data: any }) {
  return (
    <PremiumHeroHeader
      badge={data.badge}
      title={
        <>
          {data.titleStart}
          <span className="text-[#009739]">{data.titleHighlight}</span>
          {data.titleEnd}
        </>
      }
      description={data.description}
    />
  );
}
