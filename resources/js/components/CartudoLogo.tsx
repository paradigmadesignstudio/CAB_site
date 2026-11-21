import { cn } from "@/lib/utils";
import { cartudoBrand } from "@/lib/cartudoBrand";

type CartudoLogoSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface CartudoLogoProps {
  size?: CartudoLogoSize;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

const containerBySize: Record<CartudoLogoSize, string> = {
  xs: "px-3 py-2",
  sm: "px-3.5 py-2.5",
  md: "px-5 py-3.5",
  lg: "px-6 py-4",
  xl: "px-8 py-5",
  "2xl": "px-10 py-6",
};

const imageBySize: Record<CartudoLogoSize, string> = {
  xs: "h-6",
  sm: "h-8",
  md: "h-12",
  lg: "h-16 sm:h-[4.5rem]",
  xl: "h-[4.5rem] sm:h-20",
  "2xl": "h-20 sm:h-24",
};

export function CartudoLogo({
  size = "md",
  className,
  imageClassName,
  priority = false,
}: CartudoLogoProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-xl border bg-white shadow-[0_10px_28px_-14px_rgba(0,0,0,0.28)]",
        containerBySize[size],
        className,
      )}
      style={{ borderColor: `${cartudoBrand.colors.blue}40` }}
    >
      <img
        src={cartudoBrand.logoSrc}
        alt={cartudoBrand.name}
        className={cn("w-auto max-w-full object-contain", imageBySize[size], imageClassName)}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
      />
    </div>
  );
}
