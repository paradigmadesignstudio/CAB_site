import { Map, MapControls, MapMarker, MarkerContent, MarkerLabel } from "@/pages/ui/map";
import { cabMapProps } from "@/lib/cab-map";

const CAB_COORDINATES = {
  lng: -46.79080239865503,
  lat: -21.976888775811894,
} as const;

const ZOOM = 15;

export function SupportCabMap() {
  return (
    <Map
      {...cabMapProps}
      viewport={{ center: [CAB_COORDINATES.lng, CAB_COORDINATES.lat], zoom: ZOOM }}
      className="h-full w-full"
    >
      <MapControls position="bottom-right" showZoom showCompass />
      <MapMarker longitude={CAB_COORDINATES.lng} latitude={CAB_COORDINATES.lat}>
        <MarkerContent>
          <div className="relative flex items-center justify-center">
            <span className="absolute size-8 rounded-full border border-[#009739]/30 bg-[#009739]/10" />
            <div className="relative size-5 rounded-full border-2 border-white bg-[#009739] shadow-lg" />
          </div>
          <MarkerLabel
            position="top"
            className="mb-2 max-w-[240px] whitespace-normal rounded-lg border border-white/40 bg-white px-3 py-1.5 text-center text-xs font-bold leading-snug text-[#003B7A] shadow-md"
          >
            CAB - Câmbio Automático do Brasil
          </MarkerLabel>
        </MarkerContent>
      </MapMarker>
    </Map>
  );
}
