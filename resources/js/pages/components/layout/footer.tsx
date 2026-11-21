import { useState } from "react";
import { Link } from "@inertiajs/react";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/pages/ui/collapsible";
import { cn } from "@/lib/utils";
import { INERTIA_PREFETCH_HOVER } from "@/lib/inertiaPrefetch";
import { useSiteFeatures } from "@/hooks/useSiteFeatures";
import { TextWithCab } from "@/components/TextWithCab";
import { FOOTER_LINK_SECTIONS, type FooterLinkSection } from "@/pages/components/layout/data/footer";
import { FooterCredits } from "@/pages/components/layout/FooterCredits";
import { ReclameAquiSeal } from "@/pages/components/layout/reclame-aqui-seal";

const LEGAL_SECTION_TITLE = "Legal";

function isExternalHref(href: string): boolean {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

function FooterNavLink({
  href,
  label,
  prominent = false,
}: {
  href: string;
  label: string;
  prominent?: boolean;
}) {
  const className = prominent
    ? "text-white/90 hover:text-[#319600] font-bold font-mono text-xs transition-colors inline-block leading-snug"
    : "text-white/60 hover:text-[#319600] font-bold font-mono text-[10px] sm:text-xs transition-colors inline-block leading-snug hover:translate-x-1";

  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        <TextWithCab text={label} />
      </a>
    );
  }

  return (
    <Link href={href} prefetch={INERTIA_PREFETCH_HOVER} className={className}>
      <TextWithCab text={label} />
    </Link>
  );
}

function FooterLinkList({ section }: { section: FooterLinkSection }) {
  return (
    <ul className="space-y-1 sm:space-y-2">
      {section.links.map((link) => (
        <li key={`${section.title}-${link.label}`}>
          <FooterNavLink href={link.href} label={link.label} />
        </li>
      ))}
    </ul>
  );
}

function FooterMobileCollapsibleSection({ section }: { section: FooterLinkSection }) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="border-b border-white/10">
      <CollapsibleTrigger className="flex w-full items-center justify-between py-3 text-left">
        <h4 className="font-bold text-white text-sm">{section.title}</h4>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-white/70 transition-transform",
            open && "rotate-180",
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
        <div className="pb-3">
          <FooterLinkList section={section} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function FooterMobileLegalSection({ section }: { section: FooterLinkSection }) {
  return (
    <div className="mt-4 rounded-xl border border-white/20 bg-white/5 px-4 py-4">
      <h4 className="font-bold text-white text-sm mb-3">{section.title}</h4>
      <ul className="space-y-2.5">
        {section.links.map((link) => (
          <li key={`${section.title}-${link.label}`}>
            <FooterNavLink href={link.href} label={link.label} prominent />
          </li>
        ))}
      </ul>
    </div>
  );
}

function filterOficinasLinks(sections: FooterLinkSection[], oficinas: boolean): FooterLinkSection[] {
  if (oficinas) {
    return sections;
  }

  return sections.map((section) => ({
    ...section,
    links: section.links.filter((link) => link.href !== "/oficinas"),
  }));
}

export function Footer() {
  const { oficinas } = useSiteFeatures();
  const footerLinkSections = filterOficinasLinks(FOOTER_LINK_SECTIONS, oficinas);
  const currentYear = new Date().getFullYear();

  const collapsibleSections = footerLinkSections.filter(
    (section) => section.title !== LEGAL_SECTION_TITLE,
  );
  const legalSection = footerLinkSections.find(
    (section) => section.title === LEGAL_SECTION_TITLE,
  );

  return (
    <footer id="careers" className="relative overflow-hidden bg-white pb-4 pt-0 sm:pb-6" data-cab-manual="true">
      <section className="relative overflow-hidden bg-[#003B7A] pb-4 pt-3 sm:pb-6 sm:pt-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="py-2 md:hidden">
            {collapsibleSections.map((section) => (
              <FooterMobileCollapsibleSection key={section.title} section={section} />
            ))}
            {legalSection && <FooterMobileLegalSection section={legalSection} />}
          </div>

          <div className="hidden gap-x-4 gap-y-4 border-white/10 py-4 lg:grid lg:grid-cols-4 md:grid md:grid-cols-2">
            {footerLinkSections.map((section) => (
              <div key={section.title}>
                <h4 className="mb-3 text-sm font-bold text-white">{section.title}</h4>
                <FooterLinkList section={section} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid w-full grid-cols-1 gap-3 border-t border-[#003B7A]/10 pt-4 sm:gap-4 sm:pt-6 lg:grid-cols-3 lg:items-center">
          <div className="flex flex-col items-center gap-3 justify-self-center sm:flex-row sm:items-center sm:gap-4 lg:justify-self-start">
            <div className="transition-transform hover:scale-105">
              <Link href="/" className="relative block">
                <img
                  src="/images/geral/cab_sem_fundo.svg"
                  alt="CAB - Rede de Oficinas"
                  width={120}
                  height={40}
                  loading="lazy"
                  decoding="async"
                />
              </Link>
            </div>

            <div
              className="hidden h-8 w-px shrink-0 bg-[#003B7A]/15 sm:block"
              aria-hidden
            />

            <ReclameAquiSeal />
          </div>

          <p className="justify-self-center text-center font-mono text-[10px] leading-none text-[#003B7A]/80 sm:text-xs">
            © {currentYear} Câmbio Automático do Brasil. Todos os direitos reservados.
          </p>

          <div className="justify-self-center lg:justify-self-end">
            <FooterCredits />
          </div>
        </div>
      </div>
    </footer>
  );
}
