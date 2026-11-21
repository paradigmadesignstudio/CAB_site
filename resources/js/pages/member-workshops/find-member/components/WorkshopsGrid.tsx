import { DirectoryEntityGrid } from "@/pages/components/directory/DirectoryEntityCard";
import { WorkshopCard } from "@/pages/member-workshops/find-member/components/WorkshopCard";
import type { Workshop } from "@/pages/member-workshops/types";

interface WorkshopsGridProps {
  workshops: Workshop[];
}

export function WorkshopsGrid({ workshops }: WorkshopsGridProps) {
  return (
    <DirectoryEntityGrid
      items={workshops}
      renderCard={(workshop, index) => (
        <WorkshopCard key={workshop.id} workshop={workshop} index={index} />
      )}
    />
  );
}
