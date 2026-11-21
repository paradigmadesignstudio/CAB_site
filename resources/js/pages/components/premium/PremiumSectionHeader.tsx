import type { ReactNode } from "react";

interface PremiumSectionHeaderProps {
  label?: string;
  title: ReactNode;
  description?: string;
  light?: boolean;
  className?: string;
}

export function PremiumSectionHeader({
  label,
  title,
  description,
  light = false,
  className = "",
}: PremiumSectionHeaderProps) {
  return (
    <div className={`mb-6 md:mb-8 ${className}`}>
      {label && (
        <p
          className={`mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.28em] ${
            light ? "text-white/45" : "text-[#003B7A]/45"
          }`}
        >
          {label}
        </p>
      )}
      <h2
        className={`text-2xl font-black tracking-tight sm:text-3xl ${
          light ? "text-white" : "text-[#003B7A]"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-2 text-sm leading-relaxed sm:text-base ${
            light ? "text-white/70" : "text-[#003B7A]/60"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
