import { Fragment } from "react";
import { Cab } from "@/components/Cab";
import { cn } from "@/lib/utils";
import { isCabBrandToken, splitCabBrandText } from "@/lib/cabBrand";

interface TextWithCabProps {
  text: string;
  cabClassName?: string;
  className?: string;
}

/** Renderiza texto com espaço explícito antes da sigla CAB (ex.: "Academia CAB"). */
export function TextWithCab({ text, cabClassName, className }: TextWithCabProps) {
  const parts = splitCabBrandText(text);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (isCabBrandToken(part)) {
          return (
            <Fragment key={`cab-${index}`}>
              {index > 0 ? " " : null}
              <Cab className={cn("tracking-normal", cabClassName)} />
            </Fragment>
          );
        }

        const isBeforeCab = isCabBrandToken(parts[index + 1] ?? "");
        const normalized = isBeforeCab ? part.replace(/\s+$/, "") : part;

        if (normalized.length === 0) {
          return null;
        }

        return <span key={`text-${index}`}>{normalized}</span>;
      })}
    </span>
  );
}
