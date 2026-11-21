import { Link } from "@inertiajs/react";
import { DefaultHead } from "@/pages/components/layout/DefaultHead";
import { motion } from "framer-motion";
import {
  Camera,
  TrendingUp,
  ArrowRight,
  Settings2,
  Banknote,
  Clock3,
} from "lucide-react";
import { cartudoBrand } from "@/lib/cartudoBrand";
import { CartudoHeroShowcase } from "@/pages/plans/components/CartudoHeroShowcase";
import Layout from "@/pages/layout";
import { Button } from "@/pages/ui/button";
import {
  PremiumPageFrame,
  PremiumZebraBand,
  PremiumSectionHeader,
  PremiumHeroHeader,
} from "@/pages/components/premium";
import { resolveLucideIcon } from "@/lib/lucideIconMap";
import type { EcosystemPageContent } from "@/pages/plans/types";

interface EcosystemPageProps {
  pageContent: EcosystemPageContent;
}

export default function EcosystemPage({ pageContent }: EcosystemPageProps) {

  return (
    <Layout>
      <DefaultHead title={pageContent.meta.title} description={pageContent.meta.description} />

      <PremiumPageFrame>
        <PremiumZebraBand tone="canvas" className="py-0">
          <header className="relative overflow-hidden border-b border-[#003B7A]/8">
            <div className="absolute inset-0 bg-gradient-to-b from-white via-[#F7FAFD] to-[#FAFBFC]" />
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-80"
              style={{
                background: `radial-gradient(ellipse 90% 80% at 50% -10%, ${cartudoBrand.colors.blue}10 0%, transparent 68%)`,
              }}
              aria-hidden
            />

            <div className="relative mx-auto max-w-4xl px-4 pb-12 pt-24 sm:px-6 sm:pb-14 lg:pt-28">
              <CartudoHeroShowcase />

              <div className="mt-6 sm:mt-8">
                <PremiumHeroHeader
                  badge={pageContent.hero.badge}
                  title={pageContent.hero.title}
                  description={pageContent.hero.description}
                  footer={
                    <span
                      className="inline-flex items-center gap-2 rounded-full border border-[#003B7A]/8 bg-white/70 px-4 py-2 text-sm font-semibold text-[#003B7A]/65 shadow-[0_8px_24px_-18px_rgba(0,59,122,0.18)] backdrop-blur-sm"
                    >
                      Plataforma Cartudo CAB
                    </span>
                  }
                  embedded
                />
              </div>
            </div>
          </header>
        </PremiumZebraBand>

        <PremiumZebraBand tone="navy" className="py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-4 sm:px-6 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <PremiumSectionHeader
                label="Pilar 01"
                title={pageContent.raiox.title}
                description={pageContent.raiox.subtitle}
                light
                className="[&_h2]:text-3xl [&_p]:text-[#009739] [&_p]:font-semibold"
              />
              <p className="mb-10 text-lg leading-relaxed text-white/80">
                {pageContent.raiox.description}
              </p>

              <div className="space-y-8">
                {pageContent.raiox.features.map((feature, i) => {
                  const FeatureIcon = resolveLucideIcon(feature.icon);

                  return (
                  <div key={i} className="flex items-start gap-4">
                    <div className="mt-1 rounded-lg border border-[#009739]/40 bg-white/10 p-2 text-[#009739]">
                      <FeatureIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#AFFF00]">{feature.title}</h4>
                      <p className="mt-1 text-sm text-white/60">{feature.text}</p>
                    </div>
                  </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative min-h-[420px] h-full md:min-h-[500px]"
            >
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-[1.35rem] border-2 border-[#009739]/30 bg-[#009739]/20 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.4)]">
                <div className="relative flex h-[min(550px,70vh)] w-[min(300px,72%)] flex-col overflow-hidden rounded-[2.5rem] border-8 border-slate-900 bg-white shadow-2xl">
                  <div className="flex h-14 w-full items-end justify-center bg-slate-900 pb-2">
                    <div className="h-4 w-20 rounded-full bg-slate-800" />
                  </div>
                  <div className="space-y-4 p-4">
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-24 rounded bg-[#003B7A]/20" />
                      <span className="rounded-full bg-[#009739]/20 px-2 py-0.5 text-[10px] font-bold text-[#009739]">
                        Aprovado
                      </span>
                    </div>
                    <div className="flex h-40 items-center justify-center rounded-xl border border-[#003B7A]/10 bg-[#FAFBFC]">
                      <Camera className="h-10 w-10 text-[#003B7A]/25" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full rounded bg-[#003B7A]/10" />
                      <div className="h-3 w-3/4 rounded bg-[#003B7A]/10" />
                      <div className="h-3 w-5/6 rounded bg-[#003B7A]/10" />
                    </div>
                    <div className="mt-8 rounded-lg border border-[#009739]/20 bg-[#009739]/10 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-[#003B7A]">Orçamento Total</span>
                        <span className="text-sm font-black text-[#003B7A]">R$ 4.250,00</span>
                      </div>
                      <div className="flex h-8 items-center justify-center rounded bg-[#009739] text-[10px] font-bold text-white">
                        Gerar Laudo Raio-X
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </PremiumZebraBand>

        <PremiumZebraBand tone="surface" className="py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative order-2 min-h-[400px] h-full lg:order-1"
              >
                <div className="absolute inset-0 flex flex-col gap-4 rounded-[1.35rem] border-2 border-[#003B7A]/10 bg-white p-6 shadow-[0_20px_60px_rgba(0,59,122,0.08)]">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="h-6 w-32 rounded-md bg-[#003B7A]/10" />
                    <div className="h-10 w-10 rounded-full bg-[#009739]/20" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-[#009739]/20 bg-[#009739]/8 p-4">
                      <TrendingUp className="mb-2 h-6 w-6 text-[#009739]" />
                      <div className="mb-1 h-3 w-16 rounded bg-[#003B7A]/10" />
                      <div className="h-6 w-24 rounded bg-[#003B7A]/15" />
                    </div>
                    <div className="rounded-xl border border-[#003B7A]/15 bg-[#003B7A]/5 p-4">
                      <Banknote className="mb-2 h-6 w-6 text-[#003B7A]" />
                      <div className="mb-1 h-3 w-20 rounded bg-[#003B7A]/10" />
                      <div className="h-6 w-20 rounded bg-[#003B7A]/15" />
                    </div>
                  </div>
                  <div className="mt-4 flex-1 rounded-xl border border-[#003B7A]/10 bg-[#FAFBFC] p-4">
                    <div className="mb-3 flex items-center justify-between border-b border-[#003B7A]/10 pb-3">
                      <div className="h-3 w-24 rounded bg-[#003B7A]/10" />
                      <div className="h-3 w-12 rounded bg-[#009739]/20" />
                    </div>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="h-2 w-32 rounded bg-[#003B7A]/10" />
                          <div className="h-2 w-16 rounded bg-[#003B7A]/10" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2"
              >
                <PremiumSectionHeader
                  label="Pilar 02"
                  title={pageContent.management.title}
                  description={pageContent.management.subtitle}
                  className="[&_p]:font-semibold [&_p]:text-[#009739]"
                />
                <p className="mb-10 text-lg leading-relaxed text-[#003B7A]/70">
                  {pageContent.management.description}
                </p>

                <div className="space-y-8">
                  {pageContent.management.features.map((feature, i) => {
                    const FeatureIcon = resolveLucideIcon(feature.icon);

                    return (
                    <div key={i} className="flex items-start gap-4">
                      <div className="mt-1 rounded-lg border border-[#003B7A]/10 bg-white p-2 shadow-sm">
                        <FeatureIcon className="h-5 w-5 text-[#009739]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#003B7A]">{feature.title}</h4>
                        <p className="mt-1 text-sm text-[#003B7A]/60">{feature.text}</p>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </PremiumZebraBand>

        <PremiumZebraBand tone="canvas" className="py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-16 text-center">
              <PremiumSectionHeader
                label="Benefícios"
                title={pageContent.bentoSection.title}
                description={pageContent.bentoSection.description}
                className="mx-auto max-w-2xl text-center [&_p]:mx-auto"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {pageContent.bentoFeatures.map((bento, i) => {
                const BentoIcon = resolveLucideIcon(bento.icon);

                return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-[1.35rem] border-2 border-[#003B7A]/15 bg-gradient-to-br from-[#003B7A] via-[#002952] to-[#081A33] p-8 shadow-[0_16px_48px_-24px_rgba(0,59,122,0.35)] transition-shadow hover:shadow-[0_24px_60px_-20px_rgba(0,59,122,0.45)] ${bento.colSpan}`}
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#009739]/20">
                    <BentoIcon className="h-7 w-7 text-[#AFFF00]" />
                  </div>
                  <h4 className="mb-3 text-2xl font-black text-white">{bento.title}</h4>
                  <p className="leading-relaxed text-white/70">{bento.description}</p>
                </motion.div>
                );
              })}
            </div>
          </div>
        </PremiumZebraBand>

        <PremiumZebraBand tone="glow" className="py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-[1.35rem] border-2 border-[#003B7A]/15 bg-gradient-to-br from-[#003B7A] via-[#002952] to-[#081A33] p-12 text-center shadow-[0_24px_60px_-20px_rgba(0,59,122,0.45)] md:p-16"
            >
              <div className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full bg-[#009739]/20 blur-3xl" aria-hidden />

              {pageContent.finalCTA.badge && (
                <span className="relative mb-5 inline-flex items-center gap-2 rounded-full border border-[#AFFF00]/30 bg-[#AFFF00]/12 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#AFFF00]">
                  <Clock3 className="h-4 w-4" />
                  {pageContent.finalCTA.badge}
                </span>
              )}

              <h3 className="relative text-3xl font-black leading-tight text-white md:text-4xl">
                {pageContent.finalCTA.title}
              </h3>
              <p className="relative mx-auto mt-4 mb-8 max-w-xl text-lg text-white/80">
                {pageContent.finalCTA.description}
              </p>

              <div className="relative flex flex-col items-center justify-center gap-4">
                <span className="inline-flex h-14 items-center rounded-xl border border-white/15 bg-white/10 px-6 text-sm font-bold text-white/55">
                  Contratação em breve
                </span>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 border-white/25 bg-transparent px-8 text-sm font-bold text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href={pageContent.finalCTA.link}>
                    {pageContent.finalCTA.buttonText} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </PremiumZebraBand>
      </PremiumPageFrame>
    </Layout>
  );
}
