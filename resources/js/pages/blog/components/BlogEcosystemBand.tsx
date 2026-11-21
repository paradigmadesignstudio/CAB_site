import { Link } from "@inertiajs/react";
import {
  ArrowRight,
  CalendarDays,
  GraduationCap,
  Handshake,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useSiteFeatures } from "@/hooks/useSiteFeatures";
import {
  getEcosystemCopy,
  getEcosystemLinkOrder,
  type BlogEditorialContextKey,
  type EcosystemLinkKey,
} from "@/pages/blog/lib/blogEditorialContext";

interface EcosystemLink {
  key: EcosystemLinkKey;
  title: string;
  description: string;
  href: string;
  icon: typeof GraduationCap;
  accent: string;
}

interface BlogEcosystemBandProps {
  context?: BlogEditorialContextKey;
}

function buildLinkCatalog(oficinas: boolean): Record<EcosystemLinkKey, EcosystemLink> {
  return {
    planos: {
      key: "planos",
      title: "Planos CAB",
      description: "Treinamentos, suporte técnico e benefícios para sua oficina.",
      href: "/planos",
      icon: GraduationCap,
      accent: "#009739",
    },
    academia: {
      key: "academia",
      title: "Academia CAB",
      description: "Cursos e formação prática em transmissões automáticas.",
      href: "/academia-cab",
      icon: Sparkles,
      accent: "#FFE800",
    },
    oficinas: {
      key: "oficinas",
      title: "Oficinas",
      description: "Encontre oficinas assinantes da rede CAB perto de você.",
      href: "/oficinas",
      icon: Wrench,
      accent: "#009739",
    },
    parceiros: {
      key: "parceiros",
      title: "Parceiros",
      description: "Marcas e soluções que integram o ecossistema CAB.",
      href: "/parceiros",
      icon: Handshake,
      accent: "#003B7A",
    },
    eventos: {
      key: "eventos",
      title: "Agenda de eventos",
      description: "Congressos, workshops e encontros da comunidade CAB.",
      href: "/blog/eventos",
      icon: CalendarDays,
      accent: "#009739",
    },
  };
}

function resolveLinks(context: BlogEditorialContextKey, oficinas: boolean): EcosystemLink[] {
  const catalog = buildLinkCatalog(oficinas);
  const order = getEcosystemLinkOrder(context);

  return order
    .map((key) => {
      if (key === "oficinas" && !oficinas) {
        return catalog.parceiros;
      }
      if (key === "parceiros" && oficinas) {
        return catalog.oficinas;
      }
      return catalog[key];
    })
    .filter((link, index, array) => array.findIndex((item) => item.href === link.href) === index)
    .slice(0, 3);
}

export function BlogEcosystemBand({ context = "portal" }: BlogEcosystemBandProps) {
  const { oficinas } = useSiteFeatures();
  const copy = getEcosystemCopy(context);
  const links = resolveLinks(context, oficinas);

  return (
    <section className="border-y border-[#003B7A]/8 bg-white py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#009739]">
            Ecossistema CAB
          </p>
          <h2 className="text-xl font-black text-[#003B7A] sm:text-2xl">Vá além da leitura</h2>
          <p className="mt-1 max-w-2xl text-sm text-[#003B7A]/60">{copy.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className="group flex flex-col rounded-xl border border-[#003B7A]/12 bg-[#FAFBFC] p-5 transition-all hover:border-[#009739]/30 hover:bg-white hover:shadow-[0_12px_32px_-20px_rgba(0,59,122,0.25)]"
              >
                <div
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${link.accent}18` }}
                >
                  <Icon
                    className="h-5 w-5"
                    style={{ color: link.accent === "#FFE800" ? "#003B7A" : link.accent }}
                  />
                </div>
                <h3 className="text-base font-black text-[#003B7A] transition-colors group-hover:text-[#009739]">
                  {link.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#003B7A]/60">{link.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#009739]">
                  Explorar <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
