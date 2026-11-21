import { motion } from "framer-motion";
import { cartudoBrand } from "@/lib/cartudoBrand";

export function CartudoHeroShowcase() {
  const { colors, logoSrc, name } = cartudoBrand;

  return (
    <div className="relative flex justify-center px-2 py-2 sm:py-4">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-[min(94vw,700px)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl sm:h-72"
        style={{
          background: `radial-gradient(circle, ${colors.blue}14 0%, ${colors.blueLight}08 45%, transparent 72%)`,
        }}
        aria-hidden
      />

      <motion.img
        src={logoSrc}
        alt={name}
        decoding="async"
        fetchPriority="high"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: [0, -8, 0] }}
        transition={{
          opacity: { duration: 0.5 },
          y: { duration: 5.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.5 },
        }}
        className="relative h-32 w-full max-w-[min(100%,640px)] object-contain sm:h-36 md:h-40 lg:h-44"
        style={{
          filter: "drop-shadow(0 18px 36px rgba(27, 127, 214, 0.12)) drop-shadow(0 6px 16px rgba(0, 59, 122, 0.08))",
        }}
      />
    </div>
  );
}
