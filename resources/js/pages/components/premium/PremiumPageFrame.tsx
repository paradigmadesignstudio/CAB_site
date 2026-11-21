import type { ReactNode } from "react";

interface PremiumPageFrameProps {
  children: ReactNode;
}

export function PremiumPageFrame({ children }: PremiumPageFrameProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white pb-20 font-sans text-foreground selection:bg-[#009739]/20">
      {children}
    </div>
  );
}
