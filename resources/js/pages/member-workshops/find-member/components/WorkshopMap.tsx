"use client";

import { useEffect, useMemo } from "react";
import { Map, MapControls, useMap } from "@/pages/ui/map";
import { cabMapProps } from "@/lib/cab-map";
import { Card } from "@/pages/ui/card";
import type { Workshop } from "@/pages/member-workshops/types";
import { WorkshopMapMarker } from "./WorkshopMapMarker";

interface WorkshopMapProps {
  workshops: Workshop[];
}

const DEFAULT_CENTER: [number, number] = [-51.9253, -14.2350];
const DEFAULT_ZOOM = 4;

type WorkshopWithCoords = Workshop & { coordinates: NonNullable<Workshop["coordinates"]> };

function hasCoordinates(workshop: Workshop): workshop is WorkshopWithCoords {
  return Boolean(workshop.coordinates?.lat && workshop.coordinates?.lng);
}

function focusMapOnWorkshops(map: maplibregl.Map, workshops: WorkshopWithCoords[]) {
  if (workshops.length === 1) {
    map.easeTo({
      center: [workshops[0].coordinates.lng, workshops[0].coordinates.lat],
      zoom: 12,
      duration: 600,
    });
    return;
  }

  const lngs = workshops.map((workshop) => workshop.coordinates.lng);
  const lats = workshops.map((workshop) => workshop.coordinates.lat);

  map.fitBounds(
    [
      [Math.min(...lngs), Math.min(...lats)],
      [Math.max(...lngs), Math.max(...lats)],
    ],
    {
      padding: { top: 56, bottom: 56, left: 56, right: 56 },
      duration: 600,
      maxZoom: 12,
    },
  );
}

function WorkshopMapViewportSync({ workshops }: { workshops: WorkshopWithCoords[] }) {
  const { map, isLoaded } = useMap();
  const focusKey = workshops.map((workshop) => workshop.id).join(",");

  useEffect(() => {
    if (!map || !isLoaded || workshops.length === 0) return;

    focusMapOnWorkshops(map, workshops);
  }, [map, isLoaded, focusKey, workshops]);

  return null;
}

export function WorkshopMap({ workshops }: WorkshopMapProps) {
  const workshopsWithCoords = useMemo(
    () => workshops.filter(hasCoordinates),
    [workshops],
  );

  if (workshopsWithCoords.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">
          Nenhuma oficina com localização disponível para exibir no mapa.
        </p>
      </div>
    );
  }

  return (
    <Card className="border-border h-[500px] w-full overflow-hidden rounded-xl">
      <Map
        {...cabMapProps}
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full"
      >
        <WorkshopMapViewportSync workshops={workshopsWithCoords} />
        <MapControls position="bottom-right" showZoom showCompass />

        {workshopsWithCoords.map((workshop) => (
          <WorkshopMapMarker key={workshop.id} workshop={workshop} />
        ))}
      </Map>
    </Card>
  );
}
