import { motion, AnimatePresence } from "framer-motion";
import { Check, Star, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { cartudoBrand } from "@/lib/cartudoBrand";
import { CartudoLogo } from "@/components/CartudoLogo";
import { useLightMotion } from "@/hooks/useLightMotion";
import { PlanCtaButton } from "@/pages/plans/components/PlanCtaButton";
import { planGridColumnsClass } from "@/pages/plans/lib/planDisplay";
import type { Plan } from "@/pages/plans/types";

interface PlanCardsGridProps {
  plans: Plan[];
  prices: { [key: string]: number };
  withEcosystem: boolean;
  withFidelity: boolean;
}

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function EcosystemFeaturesBlock({ plan }: { plan: Plan }) {
  return (
    <div className="mt-5 border-t border-dashed border-[#003B7A]/12 pt-5">
      <p
        className="mb-4 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em]"
        style={{ color: cartudoBrand.colors.blue }}
      >
        <CartudoLogo size="sm" className="shadow-none" />
        Cartudo ativo
      </p>
      <ul className="space-y-3">
        {plan.ecosystemFeatures.map((feature, ecoIndex) => (
          <li
            key={`eco-${ecoIndex}`}
            className="flex gap-3 text-xs font-bold leading-snug text-[#003B7A]/80"
          >
            <Star
              className="mt-0.5 h-3.5 w-3.5 shrink-0"
              style={{
                color: cartudoBrand.colors.blue,
                fill: `${cartudoBrand.colors.blue}33`,
              }}
            />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PlanCardsGrid({ plans, prices, withEcosystem, withFidelity }: PlanCardsGridProps) {
  const useStaticMotion = useLightMotion();

  return (
    <section className="relative overflow-hidden bg-[#003B7A] px-4 py-10 md:py-14">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "4rem 100%",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#009739]/15 blur-[90px]" aria-hidden />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-[#AFFF00]/10 blur-[80px]" aria-hidden />

      <div className="relative mx-auto max-w-6xl">
        <div className={cn("grid grid-cols-1 gap-4", planGridColumnsClass(plans.length), "md:gap-5")}>
          {plans.map((plan, index) => (
            <motion.article
              key={plan.name}
              initial={useStaticMotion ? false : { opacity: 0, y: 18 }}
              whileInView={useStaticMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={useStaticMotion ? undefined : { once: true }}
              transition={useStaticMotion ? undefined : { delay: index * 0.08, duration: 0.45 }}
              className={cn(
                "group relative flex h-full flex-col rounded-[1.35rem] border bg-white/98 backdrop-blur-sm transition-all duration-300",
                plan.popular
                  ? "border-[#009739]/25 shadow-[0_24px_60px_-28px_rgba(0,151,57,0.55)] hover:border-[#009739]/40"
                  : "border-white/35 shadow-[0_16px_48px_-24px_rgba(0,0,0,0.35)] hover:border-white/55",
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full border border-[#009739]/20 bg-[#009739] px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-white shadow-[0_8px_20px_-10px_rgba(0,151,57,0.7)]">
                  Recomendado
                </span>
              )}

              <div className="flex flex-grow flex-col p-5 sm:p-7">
                <p
                  className={cn(
                    "text-base font-black tracking-tight sm:text-lg",
                    plan.popular ? "text-[#009739]" : "text-[#003B7A]",
                  )}
                >
                  {plan.name}
                </p>

                <p className="mt-4 min-h-[40px] text-sm font-medium leading-relaxed text-[#003B7A]/65">
                  {plan.description}
                </p>

                <div className="mt-6 flex items-end gap-1">
                  <span className="mb-1 text-sm font-bold text-[#003B7A]/55">R$</span>
                  <span
                    className={cn(
                      "text-3xl font-black tabular-nums tracking-tighter sm:text-4xl lg:text-5xl",
                      plan.popular ? "text-[#009739]" : "text-[#003B7A]",
                    )}
                  >
                    {formatCurrency(prices[plan.name] || 0)}
                  </span>
                  <span className="mb-1 text-sm font-medium text-[#003B7A]/50">/mês</span>
                </div>

                {useStaticMotion ? (
                  withFidelity ? (
                    <p className="mt-3 flex items-start gap-1.5 text-[11px] font-medium leading-snug text-[#003B7A]/60">
                      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#003B7A]/40" />
                      Cancelamento antes dos 12 meses implica taxa de cancelamento de 30%.
                    </p>
                  ) : (
                    <p className="mt-3 flex items-start gap-1.5 text-[11px] font-bold leading-snug text-[#003B7A]/80">
                      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#009739]" />
                      Assinatura livre. Cancele quando quiser, sem taxas.
                    </p>
                  )
                ) : (
                  <AnimatePresence mode="wait">
                    {withFidelity ? (
                      <motion.p
                        key="fidelidade-aviso"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.2 }}
                        className="mt-3 flex items-start gap-1.5 text-[11px] font-medium leading-snug text-[#003B7A]/60"
                      >
                        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#003B7A]/40" />
                        Cancelamento antes dos 12 meses implica taxa de cancelamento de 30%.
                      </motion.p>
                    ) : (
                      <motion.p
                        key="mensal-aviso"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.2 }}
                        className="mt-3 flex items-start gap-1.5 text-[11px] font-bold leading-snug text-[#003B7A]/80"
                      >
                        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#009739]" />
                        Assinatura livre. Cancele quando quiser, sem taxas.
                      </motion.p>
                    )}
                  </AnimatePresence>
                )}

                <div className="mb-5 mt-3 min-h-6">
                  {withEcosystem && prices[`${plan.name}_regular`] && (
                    useStaticMotion ? (
                      <div
                        className="flex w-fit items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-bold"
                        style={{
                          borderColor: `${cartudoBrand.colors.blue}26`,
                          backgroundColor: `${cartudoBrand.colors.blue}14`,
                          color: cartudoBrand.colors.blueDark,
                        }}
                      >
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        Após 3 meses: R$ {formatCurrency(prices[`${plan.name}_regular`])}/mês
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex w-fit items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-bold"
                        style={{
                          borderColor: `${cartudoBrand.colors.blue}26`,
                          backgroundColor: `${cartudoBrand.colors.blue}14`,
                          color: cartudoBrand.colors.blueDark,
                        }}
                      >
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        Após 3 meses: R$ {formatCurrency(prices[`${plan.name}_regular`])}/mês
                      </motion.div>
                    )
                  )}
                </div>

                <ul className="mb-8 flex-grow space-y-3.5">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex gap-3 text-sm font-medium leading-snug text-[#003B7A]/75"
                    >
                      <Check
                        className={cn(
                          "mt-0.5 h-4 w-4 shrink-0",
                          plan.popular ? "text-[#009739]" : "text-[#003B7A]/40",
                        )}
                      />
                      {feature}
                    </li>
                  ))}

                  {useStaticMotion ? (
                    withEcosystem ? <EcosystemFeaturesBlock plan={plan} /> : null
                  ) : (
                    <AnimatePresence>
                      {withEcosystem && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: 8 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: 8 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <EcosystemFeaturesBlock plan={plan} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </ul>

                <div className="mt-auto">
                  <div
                    className={cn(
                      "mb-5 h-1 overflow-hidden rounded-full bg-[#003B7A]/8",
                      plan.popular && "bg-[#009739]/10",
                    )}
                  >
                    <div
                      className={cn(
                        "h-full w-full rounded-full",
                        plan.popular ? "bg-[#009739]/40" : "bg-[#003B7A]/20",
                      )}
                    />
                  </div>

                  <PlanCtaButton
                    href={plan.href}
                    className={cn(
                      "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold shadow-[0_12px_32px_-14px_rgba(0,59,122,0.45)] transition-all hover:-translate-y-0.5",
                      plan.popular
                        ? "bg-[#009739] text-white hover:bg-[#00b344] shadow-[0_12px_32px_-14px_rgba(0,151,57,0.55)]"
                        : "bg-[#003B7A] text-white hover:bg-[#002B5A]",
                    )}
                  >
                    {plan.ctaText}
                  </PlanCtaButton>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
