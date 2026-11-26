import { ArrowUpRight } from "lucide-react";
import { PremiumSectionHeader } from "@/pages/components/premium";

interface PartnerSocialsProps {
  socials: Array<{ label: string; url: string }>;
}

export function PartnerSocials({ socials }: PartnerSocialsProps) {
  if (socials.length === 0) {
    return null;
  }

  return (
    <section>
      <PremiumSectionHeader label="Redes" title="Onde encontrar a marca" />

      <div className="flex flex-wrap gap-3">
        {socials.map((social) => (
          <a
            key={social.label}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#003B7A]/12 bg-white px-4 py-2 text-sm font-bold text-[#003B7A] shadow-[0_8px_24px_-16px_rgba(0,59,122,0.35)] transition-colors hover:border-[#009739]/40 hover:text-[#009739]"
          >
            {social.label}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        ))}
      </div>
    </section>
  );
}
