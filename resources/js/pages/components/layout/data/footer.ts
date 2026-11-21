export interface FooterLinkItem {
  /** Texto exibido no menu */
  label: string;
  /** Destino do link (rota interna ou URL externa) */
  href: string;
}

export interface FooterLinkSection {
  /** Título da coluna */
  title: string;
  links: FooterLinkItem[];
}

export const FOOTER_LINK_SECTIONS: FooterLinkSection[] = [
  {
    title: "Produtos",
    links: [
      { label: "Parceiros", href: "/parceiros" },
      { label: "Cursos", href: "/academia-cab" },
      { label: "Materiais Gratuitos", href: "/academia-cab" },
      { label: "Planos", href: "/planos" },
    ],
  },
  {
    title: "Links Rápidos",
    links: [
      { label: "Home", href: "/" },
      { label: "Eventos", href: "/blog/eventos" },
      { label: "Blog", href: "/blog" },
      { label: "Cursos", href: "/academia-cab" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre", href: "/sobre-nos" },
      { label: "Oficinas", href: "/oficinas" },
      { label: "Financeiro", href: "/suporte" },
      { label: "Contato", href: "/suporte" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Política de Privacidade", href: "/politica-de-privacidade" },
      { label: "Termos de Serviço", href: "/termos-de-servico" },
      { label: "Política de Cookies", href: "/politica-de-cookies" },
      { label: "Suporte", href: "/suporte" },
    ],
  },
];
