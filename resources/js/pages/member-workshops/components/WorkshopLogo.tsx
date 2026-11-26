import { useState } from "react";
import { Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkshopLogoProps {
  name: string;
  logo?: string;
  variant?: "card" | "hero";
  className?: string;
  priority?: boolean;
}

export function WorkshopLogo({
  name,
  logo = "",
  variant = "card",
  className,
  priority = false,
}: WorkshopLogoProps) {
  const [hasError, setHasError] = useState(false);
  const showFallback = logo.trim() === "" || hasError;

  if (showFallback) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-[#003B7A] to-[#009739]",
          variant === "card" ? "absolute inset-0" : "h-full w-full rounded-2xl",
          className,
        )}
        aria-hidden
      >
        <Wrench
          className={cn(
            "text-white/80",
            variant === "hero" ? "size-12" : "size-10",
          )}
        />
        <span className="sr-only">{name}</span>
      </div>
    );
  }

  return (
    <img
      src={logo}
      alt={name}
      width={variant === "hero" ? 280 : 160}
      height={variant === "hero" ? 112 : 64}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : undefined}
      className={cn(
        "max-h-full max-w-full object-contain",
        variant === "card" && "transition-transform duration-500 group-hover:scale-105",
        className,
      )}
      onError={() => setHasError(true)}
    />
  );
}
