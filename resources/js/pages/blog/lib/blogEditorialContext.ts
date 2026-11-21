export type BlogEditorialContextKey =
  | "portal"
  | "eventos"
  | "artigos-tecnicos"
  | "marketing-para-oficinas"
  | "dicas"
  | "hibridos-e-eletricos"
  | "mercado-do-automatico";

const CATEGORY_TO_CONTEXT: Record<string, BlogEditorialContextKey> = {
  Geral: "portal",
  Eventos: "eventos",
  "Artigos Técnicos": "artigos-tecnicos",
  "Marketing para Oficinas": "marketing-para-oficinas",
  Dicas: "dicas",
  "Híbridos e Elétricos": "hibridos-e-eletricos",
  "Mercado do Automático": "mercado-do-automatico",
};

export interface BlogNewsletterCopy {
  title: string;
  description: string;
  interests: string[];
  buttonLabel?: string;
}

export interface BlogEcosystemCopy {
  subtitle: string;
}

type EcosystemLinkKey = "planos" | "academia" | "oficinas" | "parceiros" | "eventos";

const NEWSLETTER_COPY: Record<BlogEditorialContextKey, BlogNewsletterCopy> = {
  portal: {
    title: "Receba o melhor do Portal CAB",
    description: "Boletins técnicos, agenda de eventos e novidades do mercado automático no seu e-mail.",
    interests: ["Boletim geral", "Artigos técnicos", "Eventos CAB"],
  },
  eventos: {
    title: "Não perca os próximos encontros CAB",
    description: "Avise-me sobre congressos, workshops e coberturas da comunidade CAB.",
    interests: ["Agenda de eventos", "Inscrições abertas", "Retrospectivas"],
    buttonLabel: "Quero receber a agenda",
  },
  "artigos-tecnicos": {
    title: "Boletim técnico na sua caixa de entrada",
    description: "Diagnóstico, reparo e engenharia reversa — conteúdo prático para a oficina.",
    interests: ["Artigos técnicos", "Manuais e procedimentos", "Novidades da Academia"],
    buttonLabel: "Assinar boletim técnico",
  },
  "marketing-para-oficinas": {
    title: "Dicas práticas para sua oficina crescer",
    description: "Gestão, marketing e lucratividade — receba conteúdo aplicável ao dia a dia.",
    interests: ["Marketing", "Gestão de oficina", "Cases CAB"],
    buttonLabel: "Quero receber dicas",
  },
  dicas: {
    title: "Dicas rápidas direto no seu e-mail",
    description: "Conteúdo objetivo para aplicar na oficina ainda hoje.",
    interests: ["Dicas práticas", "Checklists", "Boletim semanal"],
  },
  "hibridos-e-eletricos": {
    title: "Fique à frente em híbridos e elétricos",
    description: "Tendências, tecnologia e reparo em veículos eletrificados.",
    interests: ["Híbridos", "Elétricos", "Treinamentos especializados"],
  },
  "mercado-do-automatico": {
    title: "Panorama do mercado automático",
    description: "Análises, tendências e movimentos do setor de transmissões.",
    interests: ["Mercado", "Tendências", "Relatórios CAB"],
  },
};

const ECOSYSTEM_COPY: Record<BlogEditorialContextKey, BlogEcosystemCopy> = {
  portal: {
    subtitle: "Transforme conteúdo em resultado com os produtos e serviços do Portal CAB.",
  },
  eventos: {
    subtitle: "Participe dos encontros CAB e leve o conhecimento para a sua oficina.",
  },
  "artigos-tecnicos": {
    subtitle: "Aprofunde o que você leu com formação prática e suporte técnico CAB.",
  },
  "marketing-para-oficinas": {
    subtitle: "Escale sua oficina com o ecossistema CAB feito para o mercado automático.",
  },
  dicas: {
    subtitle: "Coloque as dicas em prática com treinamentos e benefícios CAB.",
  },
  "hibridos-e-eletricos": {
    subtitle: "Prepare sua equipe para o futuro das transmissões eletrificadas.",
  },
  "mercado-do-automatico": {
    subtitle: "Conecte leitura de mercado a decisões estratégicas na sua operação.",
  },
};

const ECOSYSTEM_LINK_ORDER: Record<BlogEditorialContextKey, EcosystemLinkKey[]> = {
  portal: ["planos", "academia", "oficinas"],
  eventos: ["eventos", "planos", "academia"],
  "artigos-tecnicos": ["academia", "planos", "oficinas"],
  "marketing-para-oficinas": ["oficinas", "planos", "academia"],
  dicas: ["academia", "planos", "oficinas"],
  "hibridos-e-eletricos": ["academia", "planos", "oficinas"],
  "mercado-do-automatico": ["planos", "academia", "parceiros"],
};

export function resolveEditorialContext(categoryName?: string): BlogEditorialContextKey {
  if (!categoryName) {
    return "portal";
  }

  return CATEGORY_TO_CONTEXT[categoryName] ?? "portal";
}

export function getNewsletterCopy(context: BlogEditorialContextKey): BlogNewsletterCopy {
  return NEWSLETTER_COPY[context];
}

export function getEcosystemCopy(context: BlogEditorialContextKey): BlogEcosystemCopy {
  return ECOSYSTEM_COPY[context];
}

export function getEcosystemLinkOrder(context: BlogEditorialContextKey): EcosystemLinkKey[] {
  return ECOSYSTEM_LINK_ORDER[context];
}

const CONTEXT_TO_CATEGORY_NAME: Partial<Record<BlogEditorialContextKey, string>> = {
  eventos: "Eventos",
  "artigos-tecnicos": "Artigos Técnicos",
  "marketing-para-oficinas": "Marketing para Oficinas",
  "hibridos-e-eletricos": "Híbridos e Elétricos",
  "mercado-do-automatico": "Mercado do Automático",
};

export function resolveNewsletterTipo(
  context: BlogEditorialContextKey,
  categoryName?: string,
): string {
  if (context === "portal") {
    return "BLOG";
  }

  if (context === "dicas" || categoryName === "Dicas") {
    return "DICAS";
  }

  const mappedName = categoryName ?? CONTEXT_TO_CATEGORY_NAME[context];

  if (mappedName && CATEGORY_TO_CONTEXT[mappedName]) {
    return mappedName;
  }

  return "BLOG";
}

export type { EcosystemLinkKey };
