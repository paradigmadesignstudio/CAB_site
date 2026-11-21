import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useLightMotion } from "@/hooks/useLightMotion";

interface PremiumHeroHeaderProps {
  badge: string;
  title: ReactNode;
  description: string;
  footer?: ReactNode;
  embedded?: boolean;
}

function PremiumHeroHeaderContent({
  badge,
  title,
  description,
  footer,
  animated,
}: PremiumHeroHeaderProps & { animated: boolean }) {
  if (!animated) {
    return (
      <>
        <span className="mb-4 inline-block font-mono text-xs font-bold uppercase tracking-[0.35em] text-[#009739]">
          {badge}
        </span>

        <h1 className="text-4xl font-black tracking-tighter text-[#003B7A] sm:text-5xl md:text-6xl lg:text-[3.5rem] lg:leading-[1.02]">
          {title}
        </h1>

        <div className="mx-auto mt-4 h-[3px] w-16 rounded-full bg-gradient-to-r from-[#009739] to-[#003B7A]/40" />

        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#121212]/70 sm:text-lg">
          {description}
        </p>

        {footer && <div className="mt-5">{footer}</div>}
      </>
    );
  }

  return (
    <>
      <motion.span
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 inline-block font-mono text-xs font-bold uppercase tracking-[0.35em] text-[#009739]"
      >
        {badge}
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.5 }}
        className="text-4xl font-black tracking-tighter text-[#003B7A] sm:text-5xl md:text-6xl lg:text-[3.5rem] lg:leading-[1.02]"
      >
        {title}
      </motion.h1>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mx-auto mt-4 h-[3px] w-16 origin-center rounded-full bg-gradient-to-r from-[#009739] to-[#003B7A]/40"
      />

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#121212]/70 sm:text-lg"
      >
        {description}
      </motion.p>

      {footer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-5"
        >
          {footer}
        </motion.div>
      )}
    </>
  );
}

export function PremiumHeroHeader({
  badge,
  title,
  description,
  footer,
  embedded = false,
}: PremiumHeroHeaderProps) {
  const shouldAnimate = !useLightMotion();

  const content = (
    <PremiumHeroHeaderContent
      badge={badge}
      title={title}
      description={description}
      footer={footer}
      animated={shouldAnimate}
    />
  );

  if (embedded) {
    return <div className="relative text-center">{content}</div>;
  }

  return (
    <header className="relative overflow-hidden border-b border-[#003B7A]/12">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#003B7A]/[0.04] to-[#009739]/[0.08]" />
      <div className="pointer-events-none absolute -right-16 top-0 h-72 w-72 rounded-full bg-[#AFFF00]/15 blur-[80px]" />
      <div className="pointer-events-none absolute -left-10 bottom-0 h-64 w-64 rounded-full bg-[#003B7A]/10 blur-[70px]" />

      <div className="relative mx-auto max-w-4xl px-4 pb-14 pt-28 text-center sm:px-6 sm:pb-16 lg:pt-32">
        {content}
      </div>
    </header>
  );
}
