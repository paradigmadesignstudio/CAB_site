import { usePage } from "@inertiajs/react";

export interface SiteCreditPartner {
  label: string;
  href: string;
  highlighted?: boolean;
  logo?: string;
}

export interface SiteCredits {
  prefix: string;
  conjunction: string;
  partners: SiteCreditPartner[];
}

const DEFAULT_CREDITS: SiteCredits = {
  prefix: "by",
  conjunction: "and",
  partners: [
    { label: "Paradigma Design Studio", href: "", logo: "/images/footer/pds-logo.png" },
    { label: "T4V", href: "", logo: "/images/footer/t4v-logo.png", highlighted: true },
  ],
};

export function useSiteCredits(): SiteCredits {
  const page = usePage<{ siteCredits?: SiteCredits }>();

  return page.props.siteCredits ?? DEFAULT_CREDITS;
}
