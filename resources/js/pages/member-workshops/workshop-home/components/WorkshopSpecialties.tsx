import { Wrench, Cog, Gauge, Cpu, Lightbulb, ShieldCheck } from "lucide-react";
import { WorkshopsSectionHeader } from "@/pages/member-workshops/components/WorkshopsSectionHeader";

interface WorkshopSpecialtiesProps {
  specialties: string[];
}

const iconMap: Record<string, React.ElementType> = {
  Wrench,
  Cog,
  Gauge,
  Cpu,
  Lightbulb,
  ShieldCheck,
};

export function WorkshopSpecialties({ specialties }: WorkshopSpecialtiesProps) {
  if (!specialties || specialties.length === 0) return null;

  return (
    <section>
      <WorkshopsSectionHeader label="Expertise" title="Especialidades" />
      <div className="flex flex-wrap gap-2.5">
        {specialties.map((specialty) => {
          const Icon = iconMap[specialty] || Wrench;

          return (
            <span
              key={specialty}
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#003B7A]/10 bg-white px-4 py-2 text-sm font-bold text-[#003B7A]/80 shadow-[0_4px_16px_-8px_rgba(0,59,122,0.2)] transition-colors hover:border-[#009739]/30"
            >
              <Icon className="h-4 w-4 text-[#009739]" />
              {specialty}
            </span>
          );
        })}
      </div>
    </section>
  );
}
