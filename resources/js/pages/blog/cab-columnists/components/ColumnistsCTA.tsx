import { Link } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";
import { PremiumSectionHeader } from "@/pages/components/premium";

export function ColumnistsCTA() {
  return (
    <div className="relative overflow-hidden rounded-[1.35rem] border-2 border-[#003B7A]/15 bg-gradient-to-br from-[#003B7A] via-[#002952] to-[#081A33] p-8 text-center shadow-[0_16px_48px_-24px_rgba(0,59,122,0.35)] sm:p-12">
      <div className="pointer-events-none absolute -right-8 top-0 h-32 w-32 rounded-full bg-[#009739]/25 blur-[50px]" aria-hidden />

      <div className="relative">
        <PremiumSectionHeader
          label="Participe"
          title="Quer ser um colunista CAB?"
          description="Tem conhecimento técnico para compartilhar? Junte-se ao nosso time de especialistas e ganhe visibilidade no mercado."
          light
          className="mb-8 text-center [&_h2]:text-3xl [&_p]:mx-auto [&_p]:max-w-xl"
        />

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/suporte"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#009739] px-6 py-3 font-bold text-white shadow-[0_8px_24px_-8px_rgba(0,151,57,0.6)] transition-all hover:-translate-y-0.5 hover:bg-[#00b344]"
          >
            Fale conosco
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/25 px-6 py-3 font-bold text-white transition-all hover:border-white/40 hover:bg-white/10"
          >
            Explorar blog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
