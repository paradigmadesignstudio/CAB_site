import type { LegalDefinition, LegalSection } from "@/pages/legal/types";

function DefinitionList({ definitions }: { definitions: LegalDefinition[] }) {
  return (
    <dl className="mt-4 space-y-4">
      {definitions.map((item) => (
        <div key={item.term} className="rounded-xl border border-[#003B7A]/10 bg-[#F8FAFC] px-4 py-3">
          <dt className="text-sm font-bold text-[#003B7A]">{item.term}</dt>
          <dd className="mt-1 text-sm leading-relaxed text-[#003B7A]/75">{item.text}</dd>
        </div>
      ))}
    </dl>
  );
}

function SectionBody({ section }: { section: LegalSection }) {
  return (
    <>
      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph.slice(0, 48)} className="mt-4 text-sm leading-relaxed text-[#003B7A]/80 sm:text-base">
          {paragraph}
        </p>
      ))}

      {section.list && section.list.length > 0 && (
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#003B7A]/80 sm:text-base">
          {section.list.map((item) => (
            <li key={item.slice(0, 48)}>{item}</li>
          ))}
        </ul>
      )}

      {section.orderedList && section.orderedList.length > 0 && (
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-[#003B7A]/80 sm:text-base">
          {section.orderedList.map((item) => (
            <li key={item.slice(0, 48)}>{item}</li>
          ))}
        </ol>
      )}

      {section.definitions && <DefinitionList definitions={section.definitions} />}

      {section.cookies && section.cookies.length > 0 && (
        <div className="mt-6 space-y-4">
          {section.cookies.map((cookie) => (
            <div
              key={cookie.name}
              className="overflow-hidden rounded-xl border border-[#003B7A]/12 bg-white shadow-[0_8px_24px_-16px_rgba(0,59,122,0.2)]"
            >
              <div className="border-b border-[#003B7A]/8 bg-[#F8FAFC] px-4 py-3">
                <p className="text-sm font-bold text-[#003B7A]">{cookie.name}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#009739]">
                  {cookie.type}
                </p>
              </div>
              <div className="grid gap-3 px-4 py-4 text-sm text-[#003B7A]/80 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#003B7A]/50">Provedor</p>
                  <p className="mt-1">{cookie.provider}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#003B7A]/50">Duração</p>
                  <p className="mt-1">{cookie.duration}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#003B7A]/50">Finalidade</p>
                  <p className="mt-1 leading-relaxed">{cookie.purpose}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {section.subsections?.map((subsection) => (
        <div key={subsection.title} className="mt-6 border-l-2 border-[#009739]/30 pl-4">
          <h3 className="text-base font-bold text-[#003B7A] sm:text-lg">{subsection.title}</h3>
          <SectionBody section={subsection} />
        </div>
      ))}

      {section.note && (
        <div className="mt-4 rounded-xl border border-[#009739]/20 bg-[#009739]/5 px-4 py-3 text-sm leading-relaxed text-[#003B7A]/80">
          {section.note}
        </div>
      )}
    </>
  );
}

export function LegalDocumentBody({ sections }: { sections: LegalSection[] }) {
  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <section key={section.title} id={section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}>
          <h2 className="text-lg font-black tracking-tight text-[#003B7A] sm:text-xl">{section.title}</h2>
          <SectionBody section={section} />
        </section>
      ))}
    </div>
  );
}
