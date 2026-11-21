export const ASSOCIATE_AREA_URL = "https://crm.cambioautomaticodobrasil.com.br/login-associado";

export const ASSOCIATE_AREA_LINK_PROPS = {
  href: ASSOCIATE_AREA_URL,
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

export interface NavSubLink {
  label: string;
  href: string;
}

export interface NavLink {
  label: string;
  href: string;
  subLinks?: NavSubLink[];
}

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: "Planos",
    href: "/planos",
    subLinks: [
      { label: "Conheça nossos planos", href: "/planos" },
      { label: "Cartudo", href: "/planos/ecossistema-integrado" },
    ],
  },
  { label: "Parceiros", href: "/parceiros" },
  { label: "Oficinas", href: "/oficinas" },
  { label: "Academia CAB", href: "/academia-cab" },
  { label: "Sobre", href: "/sobre-nos" },
  { label: "Contato", href: "/suporte" },
  {
    label: "Blog",
    href: "/blog",
    subLinks: [
      { label: "Eventos", href: "/blog/eventos" },
      { label: "Artigos Técnicos", href: "/blog/artigos-tecnicos" },
      { label: "Marketing para Oficinas", href: "/blog/marketing-para-oficinas" },
      { label: "Dicas", href: "/blog/dicas" },
      { label: "Híbridos e Elétricos", href: "/blog/hibridos-e-eletricos" },
      { label: "Mercado do Automático", href: "/blog/mercado-do-automatico" },
    ],
  },
];
