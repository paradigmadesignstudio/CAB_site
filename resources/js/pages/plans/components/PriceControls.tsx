import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "@inertiajs/react";
import { cartudoBrand } from "@/lib/cartudoBrand";

interface PriceControlsProps {
  withFidelity: boolean;
  setWithFidelity: (value: boolean) => void;
  withEcosystem: boolean;
  setWithEcosystem: (value: boolean) => void;
  ecosystemPromoPrice: number;
}

export function PriceControls({
  withFidelity,
  setWithFidelity,
  ecosystemPromoPrice,
}: PriceControlsProps) {
  const formattedEcosystemPromo = ecosystemPromoPrice.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  });

  const { colors, name } = cartudoBrand;

  return (
    <section className="relative z-20 bg-[#003B7A] px-4 py-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-stretch gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="w-full shrink-0 lg:max-w-[280px]"
          >
            <Link
              href="/planos/ecossistema-integrado"
              className="group relative block overflow-hidden rounded-2xl p-[2px] shadow-lg transition-shadow hover:shadow-xl"
              style={{ boxShadow: `0 16px 40px -18px ${colors.blue}66` }}
            >
              <div
                className="absolute inset-0 opacity-95 transition-opacity group-hover:opacity-100"
                style={{
                  background: `linear-gradient(135deg, ${colors.blueLight} 0%, ${colors.blue} 48%, ${colors.blueDark} 100%)`,
                }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                animate={{ x: ["-120%", "120%"] }}
                transition={{ duration: 2.8, repeat: Number.POSITIVE_INFINITY, ease: "linear", repeatDelay: 1.2 }}
              />

              <div className="relative rounded-[14px] bg-white px-4 py-3.5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                    style={{ backgroundColor: colors.blue }}
                  >
                    <Sparkles className="h-3 w-3 text-white" />
                    Novo
                  </span>
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    style={{ color: colors.blue }}
                  />
                </div>

                <h3
                  className="mb-1.5 text-lg font-extrabold leading-tight"
                  style={{ color: colors.blueDark }}
                >
                  {name}
                </h3>

                <p className="mb-2.5 text-xs leading-snug text-[#003B7A]/75">
                  Raio-X + Gestão por{" "}
                  <strong style={{ color: colors.blueDark }}>R$ {formattedEcosystemPromo}/mês</strong>{" "}
                  nos 3 primeiros meses.
                </p>

                <span
                  className="inline-flex items-center gap-1 text-xs font-bold"
                  style={{ color: colors.blueDark }}
                >
                  Conhecer agora
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          </motion.div>

          <div className="flex w-full flex-col items-center justify-center gap-3 lg:flex-1">
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-white/70">
              Tipo de assinatura
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <button
                onClick={() => setWithFidelity(false)}
                className={`group relative flex items-center gap-2 rounded-full border-2 px-4 py-2.5 text-xs font-bold transition-all duration-200 sm:px-8 sm:py-3 sm:text-sm ${
                  !withFidelity
                    ? "bg-white text-[#003B7A] shadow-lg shadow-white/20"
                    : "border-white/30 bg-transparent text-white/80 hover:border-white/60 hover:text-white"
                }`}
              >
                {!withFidelity && <Check className="h-4 w-4" />}
                Sem fidelidade
              </button>

              <button
                onClick={() => setWithFidelity(true)}
                className={`group relative flex items-center gap-2 rounded-full border-2 px-4 py-2.5 text-xs font-bold transition-all duration-200 sm:px-8 sm:py-3 sm:text-sm ${
                  withFidelity
                    ? "bg-white text-[#003B7A] shadow-lg shadow-white/20"
                    : "border-white/30 bg-transparent text-white/80 hover:border-white/60 hover:text-white"
                }`}
              >
                {withFidelity && <Check className="h-4 w-4" />}
                Com fidelidade
                {withFidelity && (
                  <span className="ml-1 rounded-full bg-[#003B7A]/10 px-2 py-0.5 text-[10px] font-bold text-[#003B7A]">
                    -50%
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
