export interface LegalCompanyInfo {
  legal_name: string;
  trade_name: string;
  cnpj: string;
  address: {
    street: string;
    district: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  contact_email: string;
  dpo_email: string;
  phone: string;
  website: string;
  crm_url: string;
}

export interface LegalDefinition {
  term: string;
  text: string;
}

export interface LegalCookieRow {
  name: string;
  provider: string;
  type: string;
  purpose: string;
  duration: string;
}

export interface LegalSection {
  title: string;
  paragraphs?: string[];
  list?: string[];
  orderedList?: string[];
  definitions?: LegalDefinition[];
  subsections?: LegalSection[];
  cookies?: LegalCookieRow[];
  note?: string;
}

export interface LegalRelatedLink {
  label: string;
  href: string;
}

export interface LegalDocument {
  slug: string;
  meta: {
    title: string;
    description: string;
  };
  heading: string;
  lastUpdated: string;
  summary: string;
  sections: LegalSection[];
  company: LegalCompanyInfo;
  relatedLinks: LegalRelatedLink[];
}

export interface LegalPageProps {
  document: LegalDocument;
}
