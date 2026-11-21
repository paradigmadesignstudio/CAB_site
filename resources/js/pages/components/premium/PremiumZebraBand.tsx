import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PremiumZebraTone = "canvas" | "surface" | "glow" | "navy";

interface PremiumZebraBandProps {
  id?: string;
  tone: PremiumZebraTone;
  children: ReactNode;
  className?: string;
}

export function PremiumZebraBand({
  id,
  tone,
  children,
  className,
}: PremiumZebraBandProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden",
        tone === "canvas" &&
          "border-b border-[#003B7A]/12 bg-gradient-to-b from-white via-white to-[#003B7A]/[0.07]",
        tone === "surface" && "border-y border-[#003B7A]/10 bg-[#FAFBFC]",
        tone === "glow" &&
          "border-t border-[#003B7A]/12 bg-gradient-to-b from-white via-[#009739]/[0.04] to-white",
        tone === "navy" && "border-y border-[#003B7A]/20 bg-[#003B7A]",
        className,
      )}
    >
      {tone === "canvas" && (
        <>
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-[min(28rem,50vw)] w-[min(28rem,50vw)] rounded-full bg-[#009739]/12 blur-[100px]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-32 -left-20 h-[min(24rem,45vw)] w-[min(24rem,45vw)] rounded-full bg-[#003B7A]/10 blur-[90px]"
            aria-hidden
          />
        </>
      )}

      {tone === "surface" && (
        <>
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#003B7A]/20 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.45]"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(0, 59, 122, 0.035) 1px, transparent 1px)",
              backgroundSize: "100% 3.5rem",
            }}
            aria-hidden
          />
        </>
      )}

      {tone === "glow" && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#003B7A]/[0.06] to-transparent"
          aria-hidden
        />
      )}

      {tone === "navy" && (
        <>
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "4rem 100%",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#009739]/15 blur-[90px]"
            aria-hidden
          />
        </>
      )}

      <div className="relative z-10">{children}</div>
    </section>
  );
}
