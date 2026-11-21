import { ExternalLink } from "lucide-react";
import { Button } from "@/pages/ui/button";
import type { AgendaEventDetail } from "@/types/agenda";
import { cn } from "@/lib/utils";

export function canShowEventPurchase(event: AgendaEventDetail): boolean {
  return event.status !== "ended" && Boolean(event.ticketUrl);
}

interface EventPurchaseButtonProps {
  event: AgendaEventDetail;
  label?: string;
  className?: string;
  fullWidth?: boolean;
}

export function EventPurchaseButton({
  event,
  label = "Garantir minha vaga",
  className,
  fullWidth = true,
}: EventPurchaseButtonProps) {
  if (!canShowEventPurchase(event) || !event.ticketUrl) {
    return null;
  }

  return (
    <Button
      asChild
      className={cn(
        "h-12 rounded-full bg-white text-sm font-bold text-[#003B7A] hover:bg-white/90",
        fullWidth && "w-full",
        className,
      )}
    >
      <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer">
        {label}
        <ExternalLink className="ml-2 h-3.5 w-3.5 opacity-70" />
      </a>
    </Button>
  );
}
