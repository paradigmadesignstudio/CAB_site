import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CabProps {
  children?: ReactNode;
  className?: string;
}

/** Marca a sigla CAB para não ser traduzida por extensões e pelo Google Translate. */
export function Cab({ children = "CAB", className }: CabProps) {
  return (
    <span
      translate="no"
      className={cn("notranslate", className)}
      data-cab-protected="true"
    >
      {children}
    </span>
  );
}
