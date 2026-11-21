import { DirectoryEntityGrid } from "@/pages/components/directory/DirectoryEntityCard";
import { PartnerCard } from "@/pages/partners/find-partner/components/PartnerCard";
import type { Partner } from "@/pages/partners/types";

interface PartnerGridProps {
  partners: Partner[];
}

export function PartnerGrid({ partners }: PartnerGridProps) {
  return (
    <DirectoryEntityGrid
      items={partners}
      renderCard={(partner, index) => (
        <PartnerCard key={partner.id} partner={partner} index={index} />
      )}
    />
  );
}
