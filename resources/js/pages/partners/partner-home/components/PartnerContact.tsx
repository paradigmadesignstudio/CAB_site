import { Phone } from "lucide-react";
import { PremiumSectionHeader } from "@/pages/components/premium";

interface PartnerContactProps {
  phone?: string;
  whatsapp?: string;
  email?: string;
}

function telHref(value: string): string {
  const digits = value.replace(/[^\d+]/g, "");

  return `tel:${digits}`;
}

function whatsappHref(value: string): string {
  const digits = value.replace(/\D/g, "");

  return `https://wa.me/${digits}`;
}

export function PartnerContact({ phone, whatsapp, email }: PartnerContactProps) {
  const phoneValue = phone?.trim() ?? "";
  const whatsappValue = whatsapp?.trim() ?? "";
  const emailValue = email?.trim() ?? "";

  if (!phoneValue && !whatsappValue && !emailValue) {
    return null;
  }

  return (
    <section>
      <PremiumSectionHeader label="Contato" title="Fale com a marca" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {phoneValue && (
          <a
            href={telHref(phoneValue)}
            className="flex items-start gap-3 rounded-[1.35rem] border-2 border-[#003B7A]/10 bg-white p-4 shadow-[0_8px_30px_-14px_rgba(0,59,122,0.15)] transition-colors hover:border-[#009739]/30 sm:p-5"
          >
            <div className="shrink-0 rounded-full bg-[#009739]/10 p-2.5">
              <Phone className="h-5 w-5 text-[#009739]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#003B7A]">Telefone</p>
              <p className="text-sm text-[#003B7A]/65">{phoneValue}</p>
            </div>
          </a>
        )}

        {emailValue && (
          <a
            href={`mailto:${emailValue}`}
            className="flex items-start gap-3 rounded-[1.35rem] border-2 border-[#003B7A]/10 bg-white p-4 shadow-[0_8px_30px_-14px_rgba(0,59,122,0.15)] transition-colors hover:border-[#009739]/30 sm:p-5"
          >
            <div className="shrink-0 rounded-full bg-[#009739]/10 p-2.5">
              <Phone className="h-5 w-5 text-[#009739]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#003B7A]">E-mail</p>
              <p className="text-sm text-[#003B7A]/65">{emailValue}</p>
            </div>
          </a>
        )}

        {whatsappValue && (
          <a
            href={whatsappHref(whatsappValue)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 rounded-[1.35rem] border-2 border-[#003B7A]/10 bg-white p-4 shadow-[0_8px_30px_-14px_rgba(0,59,122,0.15)] transition-colors hover:border-[#009739]/30 sm:p-5"
          >
            <div className="shrink-0 rounded-full bg-[#009739]/10 p-2.5">
              <Phone className="h-5 w-5 text-[#009739]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#003B7A]">WhatsApp</p>
              <p className="text-sm text-[#003B7A]/65">{whatsappValue}</p>
            </div>
          </a>
        )}
      </div>
    </section>
  );
}
