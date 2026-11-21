import { WorkshopsSectionHeader } from "@/pages/member-workshops/components/WorkshopsSectionHeader";

interface WorkshopDescriptionProps {
  description: string;
}

export function WorkshopDescription({ description }: WorkshopDescriptionProps) {
  if (!description.trim()) {
    return null;
  }

  return (
    <section>
      <WorkshopsSectionHeader label="Perfil" title="Sobre a oficina" />
      <p className="whitespace-pre-line rounded-[1.35rem] border-2 border-[#003B7A]/10 bg-white p-5 text-sm leading-relaxed text-[#003B7A]/75 shadow-[0_8px_30px_-14px_rgba(0,59,122,0.15)] sm:p-6 sm:text-base">
        {description}
      </p>
    </section>
  );
}
