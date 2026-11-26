import type {
  Coordinates,
  FAQSectionContent,
  HeroContent,
  ListSectionContent,
  PageMeta,
  CTAContent,
} from "@/types/common";

export interface Partner {
  id: number;
  slug: string;
  name: string;
  logo: string;
  /** Variante compacta do logo para mobile, quando a API fornecer. */
  logoMobile?: string | null;
  website: string;
  description: string;
  /** Resumo curto da API (short_description), exibido na página de detalhe. */
  shortDescription?: string;
  /** História ou texto longo do patrocinador (API: long_description / historia). */
  story?: string;
  fullDescription?: string;
  videoUrl?: string;
  role?: "sponsor" | "partner";
  category?: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  socials?: Array<{ label: string; url: string }>;
  gallery?: string[];
  partnershipLevel?: "Ouro" | "Prata" | "Bronze";
  since?: string;
  highlights?: string[];
  coordinates?: Coordinates;
}

export interface PartnerCategory {
  value: string;
  label: string;
}

export interface PartnerListPageContent {
  meta: PageMeta;
  hero: HeroContent;
  listSection: ListSectionContent;
  faq: FAQSectionContent;
  becomePartner: CTAContent;
}

export interface PartnerDetailPageProps {
  slug: string;
}

export interface PartnerListPageProps {
  pageContent: PartnerListPageContent;
  categories: PartnerCategory[];
  partners?: Partner[];
}

export interface PartnerDetailPageComponentProps extends PartnerDetailPageProps {
  partner?: Partner | null;
}
