import { EventDetailSectionHeader } from "./EventDetailSectionHeader";
import type { AgendaEventScheduleDay } from "@/types/agenda";

interface EventDetailScheduleProps {
  schedule: AgendaEventScheduleDay[];
}

export function EventDetailSchedule({ schedule }: EventDetailScheduleProps) {
  return (
    <section>
      <EventDetailSectionHeader label="Programação" title="Agenda do evento" />

      <div className="space-y-8">
        {schedule.map((day) => (
          <div key={day.label}>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#AFFF00]">
              {day.label}
            </h3>

            <ol className="divide-y divide-white/10 rounded-xl border border-white/10 bg-white/[0.02]">
              {day.items.map((item) => (
                <li
                  key={`${day.label}-${item.time}-${item.title}`}
                  className="flex gap-4 px-4 py-4 sm:gap-6 sm:px-5"
                >
                  <p className="w-14 shrink-0 font-mono text-xs font-semibold tabular-nums text-white/45 sm:w-16">
                    {item.time}
                  </p>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white sm:text-base">{item.title}</p>
                    {item.speaker && (
                      <p className="mt-1 text-xs text-white/45">{item.speaker}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}
