import { MapPin } from "lucide-react";
import { DirectoryEntityCard } from "@/pages/components/directory/DirectoryEntityCard";
import { WorkshopLogo } from "@/pages/member-workshops/components/WorkshopLogo";
import type { Workshop } from "@/pages/member-workshops/types";

interface WorkshopCardProps {
  workshop: Workshop;
  index?: number;
}

export function WorkshopCard({ workshop, index = 0 }: WorkshopCardProps) {
  return (
    <DirectoryEntityCard
      name={workshop.name}
      logo={workshop.logo}
      logoMedia={<WorkshopLogo name={workshop.name} logo={workshop.logo} variant="card" />}
      detailHref={`/oficinas/${workshop.slug}`}
      detailLabel="Ver oficina"
      index={index}
      titleClassName="line-clamp-1"
      badge={
        <span className="shrink-0 rounded-full border border-[#009739]/20 bg-[#009739]/8 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#009739]">
          {workshop.category}
        </span>
      }
      body={
        <>
          {workshop.specialties && workshop.specialties.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {workshop.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="rounded-full border border-[#003B7A]/10 bg-[#003B7A]/5 px-2.5 py-0.5 text-[10px] font-bold text-[#003B7A]/70"
                >
                  {specialty}
                </span>
              ))}
            </div>
          )}

          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-[#003B7A]/65">
            {workshop.description}
          </p>

          <div className="mb-5 flex items-center gap-2 text-sm text-[#003B7A]/55">
            <MapPin className="h-4 w-4 shrink-0 text-[#009739]" />
            <span>
              {workshop.city}, {workshop.state}
            </span>
          </div>
        </>
      }
    />
  );
}
