import type { BlogCategoryPageData } from "@/pages/blog/types";
import type { AgendaEvent } from "@/types/agenda";

function dedupeEvents(events: AgendaEvent[]): AgendaEvent[] {
  const seen = new Set<number>();
  return events.filter((event) => {
    if (seen.has(event.id)) {
      return false;
    }
    seen.add(event.id);
    return true;
  });
}

export function buildEventsSections(categoryData: BlogCategoryPageData) {
  return {
    agendaEvents: dedupeEvents(categoryData.upcomingEvents ?? []),
    pastEvents: dedupeEvents(categoryData.pastEvents ?? []),
  };
}
