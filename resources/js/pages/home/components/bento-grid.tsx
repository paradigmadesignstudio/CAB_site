import { Zap, Flame, Brain, Sparkles } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "CAB",
    subtitle: "Câmbio Automático do Brasil",
    description: "Consultoria técnica em Transmissões Automáticas e Automatizadas.",
    accent: "#009739",
  },
  {
    icon: Flame,
    title: "Oficinas",
    subtitle: "Projeto Seja CAB",
    description: "Maior e melhor plataforma de informação do mercado automotivo brasileiro.",
    accent: "#FFE800",
  },
  {
    icon: Sparkles,
    title: "App",
    subtitle: "Guia de Transmissão",
    description: "Pioneiro e mais atualizado aplicativo, onde o reparador tem acesso a informações técnicas.",
    accent: "#009739",
  },
  {
    icon: Brain,
    title: "Inovação",
    subtitle: "Laboratório CAB",
    description: "Engenharia reversa em transmissões inéditas. Manuais de serviço exclusivos.",
    accent: "#FFE800",
  },
]

function FeatureCard({ feature }: { feature: (typeof features)[0] }) {
  return (
    <div className="relative block">
      <div className="relative h-full overflow-hidden rounded-2xl border border-white/70 p-5">
        <div className="relative z-10 flex h-full min-h-[140px] flex-col">
          <div
            className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${feature.accent}20` }}
          >
            <feature.icon className="h-5 w-5" style={{ color: feature.accent }} />
          </div>

          <div className="flex-1">
            <div className="text-3xl font-black tracking-tight text-white">
              <span style={{ color: feature.accent }}>{feature.title}</span>
            </div>
            <h3 className="mt-1 text-sm font-semibold text-white">{feature.subtitle}</h3>
            <p className="mt-1 font-mono text-xs font-semibold text-white/50">{feature.description}</p>
          </div>

          <div className="mt-4 h-[2px] rounded-full" style={{ backgroundColor: feature.accent }} />
        </div>
      </div>
    </div>
  )
}

export function BentoGrid() {
  return (
    <section id="formula" className="relative overflow-hidden bg-[#121212] py-16">
      <div className="absolute inset-0 bg-[#003B7A]" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <span className="inline-block font-mono text-[15px] uppercase tracking-[0.3em] text-[#FFE200]">
            SOBRE NÓS
          </span>
          <div className="mt-2 overflow-hidden">
            <h2 className="text-4xl font-black tracking-tight text-[#FFE200] md:text-4xl">Conheça a CAB</h2>
          </div>
          <div className="mx-auto mt-3 h-[2px] w-12 rounded-full bg-[#FFE200]" />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
