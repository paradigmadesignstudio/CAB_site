import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useLightMotion } from "@/hooks/useLightMotion";
import { PremiumSectionHeader } from "@/pages/components/premium";
import { WorkshopsSectionHeader } from "@/pages/member-workshops/components/WorkshopsSectionHeader";
import GoogleMapsIcon from "@/pages/ui/GoogleMapsIcon";
import WazeIcon from "@/pages/ui/WazeIcon";
import { LazyLocationMap } from "@/pages/components/LazyLocationMap";

export interface LocationSectionProps {
  address: string;
  city: string;
  state: string;
  /** Coordenadas geográficas para o mapa MapLibre/Carto (preferido). */
  coordinates?: { lat: number; lng: number } | null;
  label?: string;
  title?: string;
  headerVariant?: "premium" | "workshop";
  animate?: boolean;
}

function getGoogleMapsUrl(address: string, city: string, state: string) {
  const query = encodeURIComponent(`${address}, ${city}, ${state}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
}

function getWazeUrl(address: string, city: string, state: string) {
  const query = encodeURIComponent(`${address}, ${city}, ${state}`);
  return `https://waze.com/ul?q=${query}&navigate=yes`;
}

function formatAddressLine(address: string, city: string, state: string): string {
  const street = address.trim();
  const cityState = [city.trim(), state.trim()].filter(Boolean).join(", ");

  if (street && cityState) {
    return `${street} - ${cityState}`;
  }

  return street || cityState;
}

function LocationContent({
  address,
  city,
  state,
  coordinates,
  label = "Endereço",
  title = "Localização",
  headerVariant = "premium",
}: LocationSectionProps) {
  const googleMapsUrl = getGoogleMapsUrl(address, city, state);
  const wazeUrl = getWazeUrl(address, city, state);
  const addressLine = formatAddressLine(address, city, state);
  const hasCoords = coordinates && coordinates.lat !== 0 && coordinates.lng !== 0;
  const showMap = hasCoords || addressLine;

  const header =
    headerVariant === "workshop" ? (
      <WorkshopsSectionHeader label={label} title={title} />
    ) : (
      <PremiumSectionHeader label={label} title={title} />
    );

  return (
    <>
      {header}

      {addressLine && (
        <div className="mb-4 flex flex-col gap-4 rounded-[1.35rem] border-2 border-[#003B7A]/10 bg-white p-4 shadow-[0_8px_30px_-14px_rgba(0,59,122,0.15)] sm:flex-row sm:items-start sm:p-5">
          <div className="flex flex-1 items-start gap-3">
            <div className="shrink-0 rounded-full bg-[#009739]/10 p-2.5">
              <MapPin className="h-5 w-5 text-[#009739]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#003B7A]">Endereço</p>
              <p className="break-words text-sm text-[#003B7A]/65">
                {addressLine}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#003B7A]/45">
              Me leve até lá
            </span>
            <div className="flex items-center gap-2">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-[#003B7A]/10 bg-[#FAFBFC] p-2.5 transition-colors hover:border-[#003B7A]/25"
                title="Abrir no Google Maps"
              >
                <GoogleMapsIcon className="h-6 w-6 text-[#003B7A]" />
              </a>
              <a
                href={wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-[#009739]/15 bg-[#009739]/8 p-2.5 transition-colors hover:border-[#009739]/30"
                title="Abrir no Waze"
              >
                <WazeIcon className="h-6 w-6 text-[#003B7A]" />
              </a>
            </div>
          </div>
        </div>
      )}

      {showMap && (
        <LazyLocationMap
          latitude={hasCoords ? coordinates.lat : undefined}
          longitude={hasCoords ? coordinates.lng : undefined}
          addressQuery={!hasCoords ? addressLine : undefined}
        />
      )}
    </>
  );
}

export function LocationSection({ animate = false, ...props }: LocationSectionProps) {
  const useStaticMotion = useLightMotion();

  if (animate && !useStaticMotion) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        <LocationContent {...props} />
      </motion.section>
    );
  }

  return (
    <section>
      <LocationContent {...props} />
    </section>
  );
}
