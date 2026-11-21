import { motion } from "framer-motion";
import { Phone, Smartphone, Mail, MapPin, ExternalLink } from "lucide-react";
import { useLightMotion } from "@/hooks/useLightMotion";
import { PremiumSectionHeader } from "@/pages/components/premium";
import type { ContactInfoItem } from "@/pages/support/types";

const iconMap: Record<string, React.ElementType> = {
  Phone,
  Smartphone,
  Mail,
  MapPin,
};

interface ContactCardsSectionProps {
  info: ContactInfoItem[];
}

export function ContactCardsSection({ info }: ContactCardsSectionProps) {
  const useStaticMotion = useLightMotion();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <PremiumSectionHeader
        label="Contato"
        title="Canais de Atendimento"
        description="Atendemos por telefone, WhatsApp, e-mail e presencialmente em nosso escritório."
        light
        className="mb-10 text-center md:mb-12 [&_h2]:mx-auto [&_p]:mx-auto"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
        {info.map((item, index) => {
          const Icon = iconMap[item.icon] || MapPin;
          return (
            <motion.a
              key={item.title}
              href={item.link}
              target={item.icon === "MapPin" ? "_blank" : undefined}
              rel="noopener noreferrer"
              initial={useStaticMotion ? false : { opacity: 0, y: 18 }}
              whileInView={useStaticMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={useStaticMotion ? undefined : { once: true, margin: "-50px" }}
              transition={useStaticMotion ? undefined : { duration: 0.4, delay: index * 0.08 }}
              className="group flex min-w-0 flex-col items-center overflow-hidden rounded-[1.35rem] border border-white/35 bg-white/98 p-6 text-center shadow-[0_16px_48px_-24px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/50 hover:shadow-[0_20px_50px_-18px_rgba(0,0,0,0.4)]"
            >
              <div className={`mb-4 shrink-0 rounded-2xl p-3 ${item.color} bg-opacity-20`}>
                <Icon className="h-6 w-6 text-[#003B7A]" />
              </div>
              <h3 className="mb-2 w-full break-words text-lg font-black tracking-tight text-[#003B7A]">
                {item.title}
              </h3>
              <p className="mb-3 w-full break-words text-sm text-[#003B7A]/65">{item.content}</p>
              <span className="inline-flex shrink-0 items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#009739] group-hover:underline">
                Acessar <ExternalLink className="h-3 w-3" />
              </span>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
