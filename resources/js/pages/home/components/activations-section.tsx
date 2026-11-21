import { Link } from "@inertiajs/react"
import { Handshake, Wrench, ChartNoAxesCombined, Globe } from "lucide-react"
import { INERTIA_PREFETCH_HOVER } from "@/lib/inertiaPrefetch"

const activations = [
  {
    icon: Handshake,
    title: "Plataforma 1.4",
    description: "O Passo Seguro para o Diagnóstico correto.",
    cta: "Conhecer Plataforma 1.4",
    href: "/planos",
    image: "/images/geral/1-4.jpeg",
  },
  {
    icon: Wrench,
    title: "Plataforma 2.0",
    description: "Capacitação para Reparos e Reformas.",
    cta: "Descobrir Benefícios 2.0",
    href: "/planos",
    image: "/images/geral/2-0.webp",
  },
  {
    icon: Globe,
    title: "Plataforma 3.0",
    description: "Expert em Câmbios Automáticos e Automatizados.",
    cta: "Ver o Pacote Completo 3.0",
    href: "/planos",
    image: "/images/geral/3-0.jpeg",
  },
  {
    icon: ChartNoAxesCombined,
    title: "CarTudo",
    description: "O braço que faltava para a Gestão da Oficina. Raio-X do veículo e gestão integrada.",
    cta: "Conhecer CarTudo",
    href: "/planos/ecossistema-integrado",
    image: "/images/geral/logo_cartudo.png",
    imageClassName: "object-contain px-5 py-7 bg-white scale-105",
  },
]

export function ActivationsSection() {
  return (
    <section id="distributors" className="relative py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10 text-center">
          <span className="inline-block font-mono text-xl font-bold tracking-wide text-[#009739] sm:text-2xl sm:tracking-widest md:text-4xl">
            CONHEÇA NOSSOS PLANOS
          </span>

          <p className="mx-auto mt-2 max-w-xl pt-4 font-mono text-sm font-semibold text-[#009739]/60">
            Cada oficina tem um ritmo, mas todas precisam da engrenagem certa para crescer.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {activations.map((activation) => (
            <div
              key={activation.title}
              className="group relative cursor-pointer overflow-hidden rounded-3xl bg-[#121212] shadow-xl"
            >
              <Link href={activation.href} prefetch={INERTIA_PREFETCH_HOVER} className="relative z-10 flex h-full min-h-[320px] w-full flex-col sm:min-h-[360px] md:min-h-[400px]">
                <div className="relative w-full">
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={activation.image}
                      alt={activation.title}
                      loading="lazy"
                      decoding="async"
                      className={`h-full w-full transition-transform duration-500 ease-out group-hover:scale-110 ${
                        "imageClassName" in activation && activation.imageClassName
                          ? activation.imageClassName
                          : "object-cover"
                      }`}
                    />
                    {!("imageClassName" in activation && activation.imageClassName) && (
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent" />
                    )}
                  </div>

                  <div className="absolute bottom-0 left-6 z-20 flex h-12 w-12 translate-y-1/2 items-center justify-center rounded-xl bg-[#009739] shadow-lg transition-colors duration-300 group-hover:bg-white">
                    <activation.icon className="h-5 w-5 text-white transition-colors duration-300 group-hover:text-[#009739]" />
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6 pt-10">
                  <h3 className="mb-2 text-xl font-black tracking-tight text-white transition-colors duration-300 group-hover:text-[#009739]">
                    {activation.title}
                  </h3>
                  <p className="mb-6 font-mono text-sm leading-relaxed text-white/70">
                    {activation.description}
                  </p>

                  <div className="mt-auto flex items-center gap-2 text-sm font-bold tracking-wide text-[#009739] transition-colors duration-300 group-hover:text-white">
                    {activation.cta}
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
