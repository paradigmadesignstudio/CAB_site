import { Link } from "@inertiajs/react";
import { BookOpen, ArrowRight } from "lucide-react";

export function BlogCTA() {
  return (
    <div className="flex h-full flex-col rounded-[1.35rem] border-2 border-[#003B7A]/12 bg-white p-6 shadow-[0_12px_40px_-16px_rgba(0,59,122,0.2)] transition-all hover:border-[#009739]/30">
      <div className="flex flex-1 items-start gap-4">
        <div className="shrink-0 rounded-full bg-[#003B7A]/8 p-3">
          <BookOpen className="h-6 w-6 text-[#003B7A]" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-black text-[#003B7A]">Blog CAB</h3>
          <p className="text-sm leading-relaxed text-[#003B7A]/65">
            Fique por dentro das últimas tendências em transmissão automática, dicas de manutenção e novidades do setor.
          </p>
        </div>
      </div>

      <Link
        href="/blog"
        className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#003B7A] font-bold text-white shadow-[0_8px_24px_-10px_rgba(0,59,122,0.45)] transition-all hover:-translate-y-0.5 hover:bg-[#002B5A]"
      >
        Ver artigos
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
