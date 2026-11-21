import { Link } from "@inertiajs/react";
import Layout from "@/pages/layout";
import { DefaultHead } from "@/pages/components/layout/DefaultHead";
import { PremiumPageFrame, PremiumZebraBand } from "@/pages/components/premium";
import { INERTIA_PREFETCH_HOVER } from "@/lib/inertiaPrefetch";
import { LegalDocumentBody } from "@/pages/legal/components/LegalDocumentBody";
import type { LegalPageProps } from "@/pages/legal/types";

function formatLegalDate(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`);

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function LegalPage({ document }: LegalPageProps) {
  const formattedDate = formatLegalDate(document.lastUpdated);
  const companyAddress = `${document.company.address.street}, ${document.company.address.district}, ${document.company.address.city}/${document.company.address.state}, CEP ${document.company.address.zip}`;

  return (
    <Layout>
      <DefaultHead title={document.meta.title} description={document.meta.description} />

      <PremiumPageFrame>
        <PremiumZebraBand tone="canvas" className="border-b border-[#003B7A]/8 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#009739]">
              Documentos legais
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-[#003B7A] sm:text-4xl">
              {document.heading}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#003B7A]/70 sm:text-base">
              {document.summary}
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[#003B7A]/50">
              Última atualização: {formattedDate}
            </p>
          </div>
        </PremiumZebraBand>

        <PremiumZebraBand tone="surface" className="py-10 sm:py-14">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="mb-10 rounded-xl border border-[#003B7A]/10 bg-white px-4 py-4 text-sm text-[#003B7A]/80">
              <p className="font-bold text-[#003B7A]">{document.company.legal_name}</p>
              <p className="mt-1">CNPJ {document.company.cnpj}</p>
              <p className="mt-1">{companyAddress}</p>
            </div>

            <LegalDocumentBody sections={document.sections} />

            {document.relatedLinks.length > 0 && (
              <div className="mt-12 border-t border-[#003B7A]/10 pt-8">
                <p className="text-xs font-bold uppercase tracking-wide text-[#003B7A]/50">
                  Veja também
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {document.relatedLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      prefetch={INERTIA_PREFETCH_HOVER}
                      className="rounded-full border border-[#003B7A]/15 px-4 py-2 text-sm font-semibold text-[#003B7A] transition-colors hover:border-[#009739]/40 hover:text-[#009739]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </PremiumZebraBand>
      </PremiumPageFrame>
    </Layout>
  );
}
