export interface SiteCompanyAddress {
  street: string;
  district: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface SiteCompany {
  legal_name: string;
  trade_name: string;
  cnpj: string;
  address: SiteCompanyAddress;
  contact_email: string;
  dpo_email: string;
  phone: string;
  website: string;
  crm_url: string;
}

export interface SeoSharedProps {
  appUrl?: string;
  defaultOgImage?: string;
  siteCompany?: SiteCompany;
}
