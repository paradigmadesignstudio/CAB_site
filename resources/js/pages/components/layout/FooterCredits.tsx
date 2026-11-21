import { cn } from "@/lib/utils";
import { useSiteCredits } from "@/hooks/useSiteCredits";
import type { SiteCreditPartner } from "@/hooks/useSiteCredits";

const ROW_CLASS_NAME = "inline-flex h-3.5 items-center gap-x-1.5 sm:h-4 sm:gap-x-2";

const LABEL_CLASS_NAME =
  "inline-flex h-full items-center font-mono text-[10px] leading-none text-[#003B7A]/35 sm:text-[11px]";

const LOGO_SIZES = {
  default: {
    link: "inline-flex h-3.5 shrink-0 items-center justify-center sm:h-4",
    img: "block h-3.5 w-auto max-h-3.5 object-contain sm:h-4 sm:max-h-4",
  },
  sm: {
    link: "inline-flex h-3 shrink-0 items-center justify-center sm:h-3.5",
    img: "block h-3 w-auto max-h-3 object-contain sm:h-3.5 sm:max-h-3.5",
  },
} as const;

function CreditPartner({ label, href, highlighted = false, logo }: SiteCreditPartner) {
  const url = href.trim();
  const sizes = highlighted ? LOGO_SIZES.sm : LOGO_SIZES.default;
  const linkClassName = cn(
    sizes.link,
    "opacity-80 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009739]/30",
  );

  if (logo) {
    const image = (
      <img
        src={logo}
        alt={label}
        loading="lazy"
        decoding="async"
        className={sizes.img}
      />
    );

    if (!url) {
      return <span className={linkClassName}>{image}</span>;
    }

    return (
      <a
        href={url}
        className={linkClassName}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
      >
        {image}
      </a>
    );
  }

  if (!url) {
    return (
      <span className={cn(LABEL_CLASS_NAME, "font-bold text-[#003B7A]/40")}>{label}</span>
    );
  }

  return (
    <a
      href={url}
      className={cn(LABEL_CLASS_NAME, "font-bold text-[#003B7A]/40 hover:text-[#009739]/75")}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
    </a>
  );
}

export function FooterCredits() {
  const { prefix, conjunction, partners } = useSiteCredits();

  if (partners.length === 0) {
    return null;
  }

  return (
    <div className={cn(ROW_CLASS_NAME, "justify-center whitespace-normal sm:whitespace-nowrap md:justify-end")}>
      <span className={cn(LABEL_CLASS_NAME, "uppercase tracking-[0.14em]")}>{prefix}</span>

      {partners.map((partner, index) => (
        <span key={partner.label} className={cn(ROW_CLASS_NAME, "gap-x-1.5 sm:gap-x-2")}>
          {index > 0 && (
            <span className={LABEL_CLASS_NAME}>
              {index === partners.length - 1 ? conjunction : ","}
            </span>
          )}
          <CreditPartner {...partner} />
        </span>
      ))}
    </div>
  );
}
