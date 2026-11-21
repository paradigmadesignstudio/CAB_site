import { cn } from "@/lib/utils";
import type { AgendaEventStatus } from "@/types/agenda";
import { AGENDA_STATUS_LABEL } from "@/types/agenda";

const featuredBadge =
  "px-4 py-1.5 text-sm tracking-[0.14em] shadow-[0_10px_24px_-10px_rgba(8,26,51,0.45)]";

const endedStyle = cn(
  featuredBadge,
  "bg-gradient-to-br from-[#F5C542] to-[#D4920D] text-[#081A33] shadow-[0_10px_24px_-10px_rgba(212,146,13,0.85)]",
);

const upcomingStyle = cn(
  featuredBadge,
  "bg-gradient-to-br from-[#009739] to-[#007A2E] text-white shadow-[0_10px_24px_-10px_rgba(0,151,57,0.85)]",
);

const statusStyles: Record<AgendaEventStatus, string> = {
  happening: "bg-[#009739] text-white",
  upcoming: upcomingStyle,
  ended: endedStyle,
};

const statusStylesOnDark: Record<AgendaEventStatus, string> = {
  happening: "bg-[#009739] text-white",
  upcoming: upcomingStyle,
  ended: endedStyle,
};

export function AgendaStatusBadge({
  status,
  className,
  tone = "light",
}: {
  status: AgendaEventStatus;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        tone === "dark" ? statusStylesOnDark[status] : statusStyles[status],
        className,
      )}
    >
      {AGENDA_STATUS_LABEL[status]}
    </span>
  );
}
