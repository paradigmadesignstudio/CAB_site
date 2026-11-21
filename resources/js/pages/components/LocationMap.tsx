"use client";

import { useEffect, useState } from "react";
import { Map, MapControls, MapMarker, MarkerContent } from "@/pages/ui/map";
import { cabMapProps } from "@/lib/cab-map";

interface LocationMapProps {
  latitude?: number | null;
  longitude?: number | null;
  /** Endereço para geocoding quando coordenadas não estão disponíveis. */
  addressQuery?: string;
  /** Título de acessibilidade do mapa (padrão: "Localização no mapa") */
  title?: string;
  className?: string;
}

function isValidCoord(lat?: number | null, lng?: number | null): lat is number {
  return typeof lat === "number" && typeof lng === "number" && lat !== 0 && lng !== 0;
}

/**
 * Mapa de localização usando MapLibre + Carto/OpenFreeMap (sem iframe Google Maps).
 * Aceita coordenadas diretas ou faz geocoding via Nominatim (OpenStreetMap).
 */
export function LocationMap({
  latitude,
  longitude,
  addressQuery,
  title = "Localização no mapa",
  className,
}: LocationMapProps) {
  const hasDirectCoords = isValidCoord(latitude, longitude);

  const [geocoded, setGeocoded] = useState<{ lat: number; lng: number } | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (hasDirectCoords || !addressQuery?.trim()) return;

    let cancelled = false;

    const query = encodeURIComponent(addressQuery.trim());
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${query}`,
      { headers: { Accept: "application/json" } },
    )
      .then((res) => res.json())
      .then((data: Array<{ lat: string; lon: string }>) => {
        if (cancelled) return;
        if (data.length > 0) {
          setGeocoded({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
        } else {
          setFailed(true);
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => { cancelled = true; };
  }, [hasDirectCoords, addressQuery]);

  const lat = hasDirectCoords ? latitude! : geocoded?.lat;
  const lng = hasDirectCoords ? longitude! : geocoded?.lng;

  if ((!lat || !lng) && (failed || !addressQuery?.trim())) return null;
  if (!lat || !lng) {
    return (
      <div
        role="region"
        aria-label={title}
        className={
          className ??
          "aspect-video overflow-hidden rounded-[1.35rem] border-2 border-[#003B7A]/10 shadow-[0_8px_30px_-14px_rgba(0,59,122,0.15)]"
        }
      >
        <div className="flex h-full w-full items-center justify-center bg-slate-100">
          <div className="flex gap-1">
            <span className="size-1.5 animate-pulse rounded-full bg-slate-400" />
            <span className="size-1.5 animate-pulse rounded-full bg-slate-400 [animation-delay:150ms]" />
            <span className="size-1.5 animate-pulse rounded-full bg-slate-400 [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label={title}
      className={
        className ??
        "aspect-video overflow-hidden rounded-[1.35rem] border-2 border-[#003B7A]/10 shadow-[0_8px_30px_-14px_rgba(0,59,122,0.15)]"
      }
    >
      <Map
        {...cabMapProps}
        center={[lng, lat]}
        zoom={15}
        attributionControl={{ compact: true }}
        className="h-full w-full"
      >
        <MapControls position="bottom-right" showZoom />
        <MapMarker longitude={lng} latitude={lat}>
          <MarkerContent>
            <div className="size-5 rounded-full border-2 border-white bg-[#009739] shadow-lg" />
          </MarkerContent>
        </MapMarker>
      </Map>
    </div>
  );
}
