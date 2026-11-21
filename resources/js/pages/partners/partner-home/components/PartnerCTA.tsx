import { ExternalLink, Globe } from "lucide-react";
import { safeHttpUrl } from "@/lib/safeUrl";

interface PartnerCTAProps {
  website: string;
  partnerName: string;
}

export function PartnerCTA({ website, partnerName }: PartnerCTAProps) {
  const safeWebsite = safeHttpUrl(website);

  if (!safeWebsite) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-[#AFFF00]/20 bg-gradient-to-br from-[#081A33] via-[#003B7A] to-[#002952] p-8 text-center shadow-[0_24px_70px_-28px_rgba(0,59,122,0.55)] sm:p-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "3rem 100%",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute -right-8 top-0 h-36 w-36 rounded-full bg-[#009739]/30 blur-[60px]" aria-hidden />
      <div className="pointer-events-none absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-[#AFFF00]/15 blur-[50px]" aria-hidden />

      <div className="relative">
        <div className="mx-auto mb-5 inline-flex rounded-full border border-white/15 bg-white/8 p-3 text-[#AFFF00]">
          <Globe className="h-6 w-6" />
        </div>

        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-white/45">
          Presença digital
        </p>
        <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
          Visite o site oficial
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
          Acesse o site oficial do patrocinador e descubra produtos, soluções e novidades pensadas
          para o mercado de transmissão automática.
        </p>

        <a
          href={safeWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-3 rounded-xl bg-[#AFFF00] px-10 py-4 text-base font-black text-[#003B7A] shadow-[0_12px_32px_-12px_rgba(175,255,0,0.45)] transition-all hover:-translate-y-0.5 hover:bg-[#c8ff4d] sm:text-lg"
        >
          Acessar site do patrocinador
          <ExternalLink className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}
