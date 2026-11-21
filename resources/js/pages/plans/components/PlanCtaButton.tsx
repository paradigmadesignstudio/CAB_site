import type { ReactNode } from "react";
import { Button } from "@/pages/ui/button";
import { cn } from "@/lib/utils";

interface PlanCtaButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function PlanCtaButton({ href, children, className }: PlanCtaButtonProps) {
  return (
    <Button asChild className={cn(className)}>
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    </Button>
  );
}
