import { MapPin } from "lucide-react";
import GoogleMapsIcon from "@/pages/ui/GoogleMapsIcon";
import WazeIcon from "@/pages/ui/WazeIcon";
import { LazyLocationMap } from "@/pages/components/LazyLocationMap";
import { EventDetailSectionHeader } from "./EventDetailSectionHeader";
import type { AgendaEventVenue } from "@/types/agenda";

interface EventDetailLocationProps {
  venue: AgendaEventVenue;
}

function getGoogleMapsUrl(address: string, city: string, state: string) {
  const query = encodeURIComponent(`${address}, ${city}, ${state}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
}

function getWazeUrl(address: string, city: string, state: string) {
  const query = encodeURIComponent(`${address}, ${city}, ${state}`);
  return `https://waze.com/ul?q=${query}&navigate=yes`;
}

export function EventDetailLocation({ venue }: EventDetailLocationProps) {
  const fullAddress = `${venue.address} — ${venue.city}, ${venue.state}`;
  const googleMapsUrl = getGoogleMapsUrl(venue.address, venue.city, venue.state);
  const wazeUrl = getWazeUrl(venue.address, venue.city, venue.state);
  const hasCoords = venue.coordinates && venue.coordinates.lat !== 0 && venue.coordinates.lng !== 0;
  const addressForGeocode = `${venue.name}, ${venue.city}, ${venue.state}`;

  return (
    <section>
      <EventDetailSectionHeader label="Local" title="Como chegar" />

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="shrink-0 rounded-full bg-[#AFFF00]/15 p-2.5">
              <MapPin className="h-5 w-5 text-[#AFFF00]" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">{venue.name}</p>
              <p className="mt-1 break-words text-sm leading-relaxed text-white/55">{fullAddress}</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
              Me leve até lá
            </span>
            <div className="flex items-center gap-2">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/10 bg-white/5 p-2.5 transition-colors hover:border-white/20 hover:bg-white/10"
                title="Abrir no Google Maps"
              >
                <GoogleMapsIcon className="h-6 w-6 text-white/80" />
              </a>
              <a
                href={wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/10 bg-white/5 p-2.5 transition-colors hover:border-white/20 hover:bg-white/10"
                title="Abrir no Waze"
              >
                <WazeIcon className="h-6 w-6 text-white/80" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <LazyLocationMap
          latitude={hasCoords ? venue.coordinates!.lat : undefined}
          longitude={hasCoords ? venue.coordinates!.lng : undefined}
          addressQuery={!hasCoords ? addressForGeocode : undefined}
          title={`Localização de ${venue.name}`}
          className="aspect-video overflow-hidden rounded-xl border border-white/10 ring-1 ring-white/5"
        />
      </div>
    </section>
  );
}
