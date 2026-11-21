import type { SiteCompany } from "@/types/seo";

export const DEFAULT_OG_IMAGE_PATH = "/images/carousel/cab_carousel_1.webp";

export function isUsableSeoImage(value: string | undefined | null): value is string {
  if (!value) {
    return false;
  }

  const trimmed = value.trim();

  if (trimmed === "") {
    return false;
  }

  // Blog fallback no mapper pode ser classe CSS (bg-gradient-...), não URL.
  if (trimmed.startsWith("bg-") || trimmed.includes("gradient")) {
    return false;
  }

  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/")
  );
}

export function absoluteUrl(appUrl: string | undefined, pathOrUrl: string): string | undefined {
  const value = pathOrUrl.trim();

  if (value === "") {
    return undefined;
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  if (!appUrl) {
    return undefined;
  }

  const base = appUrl.replace(/\/$/, "");
  const path = value.startsWith("/") ? value : `/${value}`;

  return `${base}${path}`;
}

export function buildOrganizationJsonLd(company: SiteCompany, appUrl: string) {
  const logo = absoluteUrl(appUrl, "/images/geral/cab.png");

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.trade_name,
    legalName: company.legal_name,
    description:
      "A CAB é apoio técnico ao reparador de transmissão automática e automatizada. Constrói material técnico, responde as principais dúvidas dentro do sistema, reúne uma rede de networking e promove eventos de estudo das transmissões e das tendências do mercado.",
    knowsAbout: [
      "apoio técnico ao reparador",
      "material técnico para reparadores",
      "rede de networking para reparadores",
      "eventos de estudo em transmissões",
      "transmissão automática",
    ],
    url: appUrl,
    logo,
    email: company.contact_email,
    telephone: company.phone,
    taxID: company.cnpj,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${company.address.street}, ${company.address.district}`,
      addressLocality: company.address.city,
      addressRegion: company.address.state,
      postalCode: company.address.zip,
      addressCountry: "BR",
    },
    sameAs: [company.crm_url].filter(Boolean),
  };
}

export function buildWebSiteJsonLd(appUrl: string, name: string) {
  const base = appUrl.replace(/\/$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    description:
      "Apoio técnico ao reparador: material técnico, dúvidas sobre transmissões no sistema, rede de networking e eventos de estudo e tendências.",
    url: appUrl,
    inLanguage: "pt-BR",
    publisher: {
      "@type": "Organization",
      name,
      url: appUrl,
    },
    hasPart: [
      {
        "@type": "WebPage",
        name: "Oficinas",
        url: `${base}/oficinas`,
        description: "Rede de apoio de oficinas que usam o material técnico da CAB.",
      },
      {
        "@type": "WebPage",
        name: "Academia CAB",
        url: `${base}/academia-cab`,
        description: "Material técnico e eventos de estudo sobre transmissões e tendências do mercado.",
      },
      {
        "@type": "WebPage",
        name: "Parceiros",
        url: `${base}/parceiros`,
        description: "Networking e fornecedores parceiros para reparadores de transmissão automática.",
      },
      {
        "@type": "WebPage",
        name: "Planos",
        url: `${base}/planos`,
        description: "No sistema CAB o reparador tira dúvidas sobre transmissões, com material técnico e apoio da rede.",
      },
    ],
  };
}

export function buildBlogPostingJsonLd(input: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  authorName?: string;
  publisherName: string;
  publisherLogo?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    mainEntityOfPage: input.url,
    url: input.url,
    ...(input.image ? { image: [input.image] } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    author: {
      "@type": "Person",
      name: input.authorName || input.publisherName,
    },
    publisher: {
      "@type": "Organization",
      name: input.publisherName,
      ...(input.publisherLogo ? { logo: { "@type": "ImageObject", url: input.publisherLogo } } : {}),
    },
  };
}

export function buildEventJsonLd(input: {
  name: string;
  description: string;
  url: string;
  image?: string;
  startDate?: string;
  locationName?: string;
  locationAddress?: string;
  organizerName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: input.name,
    description: input.description,
    url: input.url,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    ...(input.image ? { image: [input.image] } : {}),
    ...(input.startDate ? { startDate: input.startDate } : {}),
    location: {
      "@type": "Place",
      name: input.locationName || input.organizerName,
      ...(input.locationAddress
        ? {
            address: {
              "@type": "PostalAddress",
              streetAddress: input.locationAddress,
              addressCountry: "BR",
            },
          }
        : {}),
    },
    organizer: {
      "@type": "Organization",
      name: input.organizerName,
    },
  };
}

export function buildLocalBusinessJsonLd(input: {
  name: string;
  description: string;
  url: string;
  image?: string;
  telephone?: string;
  address?: string;
  city?: string;
  state?: string;
  parentOrganizationName: string;
  parentOrganizationUrl: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "AutomotiveRepair",
    name: input.name,
    description: input.description,
    url: input.url,
    ...(input.image ? { image: input.image } : {}),
    ...(input.telephone ? { telephone: input.telephone } : {}),
    address: {
      "@type": "PostalAddress",
      ...(input.address ? { streetAddress: input.address } : {}),
      ...(input.city ? { addressLocality: input.city } : {}),
      ...(input.state ? { addressRegion: input.state } : {}),
      addressCountry: "BR",
    },
    parentOrganization: {
      "@type": "Organization",
      name: input.parentOrganizationName,
      url: input.parentOrganizationUrl,
    },
  };
}

export function buildFaqPageJsonLd(
  items: Array<{ question: string; answer: string }>,
  pageUrl?: string,
) {
  const mainEntity = items
    .filter((item) => item.question.trim() !== "" && item.answer.trim() !== "")
    .map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    }));

  if (mainEntity.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(pageUrl ? { url: pageUrl } : {}),
    mainEntity,
  };
}
