import { Link } from "@inertiajs/react";
import { ChevronLeft } from "lucide-react";
import Layout from "@/pages/layout";
import { DefaultHead } from "@/pages/components/layout/DefaultHead";
import { PremiumPageFrame, PremiumZebraBand } from "@/pages/components/premium";

interface NotFoundProps {
  title: string;
  backHref: string;
  backLabel: string;
}

export function NotFound({ title, backHref, backLabel }: NotFoundProps) {
  return (
    <Layout>
      <DefaultHead title={`${title} | CAB`} />
      <PremiumPageFrame>
        <PremiumZebraBand tone="canvas" className="py-24 sm:py-32">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
            <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.35em] text-[#009739]">
              Página não encontrada
            </p>
            <h1 className="text-3xl font-black tracking-tight text-[#003B7A] sm:text-4xl">{title}</h1>
            <div className="mx-auto mt-4 h-[3px] w-16 rounded-full bg-gradient-to-r from-[#009739] to-[#003B7A]/40" />
            <Link
              href={backHref}
              className="group mt-10 inline-flex items-center gap-2 rounded-xl bg-[#003B7A] px-6 py-3 text-sm font-bold text-white shadow-[0_8px_24px_-10px_rgba(0,59,122,0.45)] transition-all hover:-translate-y-0.5 hover:bg-[#002B5A]"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              {backLabel}
            </Link>
          </div>
        </PremiumZebraBand>
      </PremiumPageFrame>
    </Layout>
  );
}
