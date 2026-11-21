import { useState } from "react";
import { MessageCircle, Phone, PhoneCall, ShieldAlert, Smartphone } from "lucide-react";
import { Button } from "@/pages/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/pages/ui/dialog";
import { formatPhoneDisplay, getPhoneDigits } from "@/lib/phoneFormat";
import { hasWorkshopContact } from "@/pages/member-workshops/services";
import type { Workshop } from "@/pages/member-workshops/types";

interface ContactModalProps {
  workshop: Pick<Workshop, "phone" | "whatsapp">;
}

interface ContactChannelCardProps {
  href: string;
  label: string;
  value: string;
  hint?: string;
  icon: typeof Phone;
  external?: boolean;
  variant?: "phone" | "mobile";
}

function ContactChannelCard({
  href,
  label,
  value,
  hint,
  icon: Icon,
  external = false,
  variant = "phone",
}: ContactChannelCardProps) {
  const isMobile = variant === "mobile";

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={
        isMobile
          ? "group flex items-center gap-4 rounded-xl border-2 border-[#003B7A]/12 bg-gradient-to-br from-[#FAFBFC] to-white p-4 transition-all hover:border-[#009739]/35 hover:shadow-[0_12px_32px_-20px_rgba(0,151,57,0.35)]"
          : "group flex items-center gap-4 rounded-xl border-2 border-[#003B7A]/10 bg-[#FAFBFC] p-4 transition-all hover:border-[#009739]/30"
      }
    >
      <div
        className={
          isMobile
            ? "rounded-2xl bg-[#003B7A]/8 p-3 transition-colors group-hover:bg-[#009739]/12"
            : "rounded-full bg-[#003B7A]/8 p-2.5 group-hover:bg-[#009739]/10"
        }
      >
        <Icon
          className={
            isMobile
              ? "h-5 w-5 text-[#003B7A] transition-colors group-hover:text-[#009739]"
              : "h-5 w-5 text-[#003B7A] group-hover:text-[#009739]"
          }
        />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#003B7A]/55">{label}</p>
        <p className="text-lg font-black tracking-tight text-[#003B7A]">{value}</p>
        {hint && <p className="mt-0.5 text-xs text-[#003B7A]/45">{hint}</p>}
      </div>
    </a>
  );
}

function buildContactDisclaimer(hasPhone: boolean, hasMobile: boolean): string {
  if (hasPhone && hasMobile) {
    return "Para sua segurança, os números de telefone e celular são exibidos somente após confirmação.";
  }

  if (hasMobile) {
    return "Para sua segurança, o número de celular é exibido somente após confirmação.";
  }

  return "Para sua segurança, o número de telefone é exibido somente após confirmação.";
}

export function ContactModal({ workshop }: ContactModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!hasWorkshopContact(workshop)) {
    return null;
  }

  const phone = workshop.phone?.trim() ?? "";
  const whatsapp = workshop.whatsapp?.trim() ?? "";
  const phoneDigits = getPhoneDigits(phone);
  const mobileDigits = getPhoneDigits(whatsapp);
  const showPhone = phoneDigits.length > 0;
  const showMobile = mobileDigits.length > 0 && mobileDigits !== phoneDigits;
  const formattedPhone = showPhone ? formatPhoneDisplay(phone) : "";
  const formattedMobile = showMobile ? formatPhoneDisplay(whatsapp) : "";

  return (
    <div className="sticky top-8 rounded-[1.35rem] border-2 border-[#003B7A]/12 bg-white p-6 shadow-[0_16px_48px_-24px_rgba(0,59,122,0.25)]">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-full bg-[#009739]/10 p-2.5">
          <PhoneCall className="h-5 w-5 text-[#009739]" />
        </div>
        <h3 className="text-lg font-black text-[#003B7A]">Contato</h3>
      </div>

      <p className="mb-6 rounded-xl border border-[#003B7A]/10 bg-[#FAFBFC] p-3 text-sm leading-relaxed text-[#003B7A]/65">
        {buildContactDisclaimer(showPhone, showMobile)}
      </p>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="h-12 w-full rounded-xl bg-[#009739] font-bold text-white shadow-[0_8px_24px_-8px_rgba(0,151,57,0.6)] hover:bg-[#00b344]">
            <ShieldAlert className="mr-2 h-4 w-4" />
            Mostrar contato
          </Button>
        </DialogTrigger>

        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-black text-[#003B7A]">
              <MessageCircle className="h-5 w-5 text-[#009739]" />
              Dados de contato
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {showPhone && (
              <ContactChannelCard
                href={`tel:${phoneDigits}`}
                label="Telefone"
                value={formattedPhone}
                icon={Phone}
                variant="phone"
              />
            )}

            {showMobile && (
              <ContactChannelCard
                href={`https://wa.me/${mobileDigits}?text=${encodeURIComponent("Olá, encontrei sua oficina no site da CAB.")}`}
                label="Celular"
                value={formattedMobile}
                hint="Toque para conversar no WhatsApp"
                icon={Smartphone}
                external
                variant="mobile"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
