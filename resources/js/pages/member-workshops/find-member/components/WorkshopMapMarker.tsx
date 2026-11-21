import {
  MapMarker,
  MarkerContent,
  MarkerLabel,
  MarkerPopup,
  MarkerTooltip,
} from "@/pages/ui/map";
import { Button } from "@/pages/ui/button";
import { Clock, ExternalLink, MapPin, Navigation, Phone, Smartphone, Star, Wrench } from "lucide-react";
import type { Workshop } from "@/pages/member-workshops/types";
import { safeHttpUrl } from "@/lib/safeUrl";
import { CmsResponsiveImage } from "@/pages/components/CmsResponsiveImage";

interface WorkshopMapMarkerProps {
  workshop: Workshop;
}

function getPopupImage(workshop: Workshop): { image: string; mobileImage?: string | null } | null {
  if (workshop.coverImage) {
    return { image: workshop.coverImage, mobileImage: workshop.coverImageMobile };
  }

  if (workshop.logo) {
    return { image: workshop.logo };
  }

  return null;
}

function getWhatsAppHref(whatsapp: string): string {
  const digits = whatsapp.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent("Olá, encontrei sua oficina no mapa do site da CAB.")}`;
}

function getTelHref(phone: string): string {
  return `tel:${phone.replace(/\s/g, "")}`;
}

function getLocationLabel(workshop: Workshop): string {
  return `${workshop.city}, ${workshop.state}`;
}

export function WorkshopMapMarker({ workshop }: WorkshopMapMarkerProps) {
  const website = safeHttpUrl(workshop.website);
  const popupImage = getPopupImage(workshop);
  const location = getLocationLabel(workshop);

  return (
    <MapMarker
      longitude={workshop.coordinates.lng}
      latitude={workshop.coordinates.lat}
    >
      <MarkerContent>
        <div className="size-5 cursor-pointer rounded-full border-2 border-white bg-[#009739] shadow-lg transition-transform hover:scale-110" />
        <MarkerLabel position="bottom" className="rounded-full bg-background/90 px-2 py-0.5 shadow-sm">
          {workshop.city}
        </MarkerLabel>
      </MarkerContent>

      <MarkerTooltip>{workshop.name}</MarkerTooltip>

      <MarkerPopup className="w-72 overflow-hidden rounded-xl border-border p-0 shadow-xl">
        <div className="relative h-28 overflow-hidden bg-[#003B7A]">
          {popupImage ? (
            <CmsResponsiveImage
              image={popupImage.image}
              mobileImage={popupImage.mobileImage}
              alt={workshop.name}
              pictureClassName="block h-full w-full"
              imageClassName="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#003B7A] to-[#009739]">
              <Wrench className="size-10 text-white/80" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <span className="absolute bottom-2 left-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#003B7A]">
            {workshop.category}
          </span>
        </div>

        <div className="space-y-2.5 p-3">
          <div>
            <h3 className="text-foreground leading-tight font-semibold">{workshop.name}</h3>
            <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed">
              {workshop.description}
            </p>
          </div>

          {(workshop.rating != null || workshop.hours) && (
            <div className="flex flex-wrap items-center gap-3 text-xs">
              {workshop.rating != null && (
                <div className="flex items-center gap-1">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{workshop.rating.toFixed(1)}</span>
                  {workshop.reviewCount != null && (
                    <span className="text-muted-foreground">
                      ({workshop.reviewCount.toLocaleString("pt-BR")})
                    </span>
                  )}
                </div>
              )}
              {workshop.hours && (
                <div className="text-muted-foreground flex items-center gap-1.5">
                  <Clock className="size-3.5 shrink-0" />
                  <span>{workshop.hours}</span>
                </div>
              )}
            </div>
          )}

          <div className="text-muted-foreground space-y-1 text-xs">
            <div className="flex items-start gap-1.5">
              <MapPin className="mt-0.5 size-3.5 shrink-0" />
              <span>{location}</span>
            </div>
            {workshop.address && (
              <p className="pl-5 leading-relaxed">{workshop.address}</p>
            )}
          </div>

          {workshop.specialties.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {workshop.specialties.slice(0, 4).map((specialty) => (
                <span
                  key={specialty}
                  className="rounded-full bg-secondary/15 px-2 py-0.5 text-[10px] font-medium text-secondary"
                >
                  {specialty}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            {workshop.phone && (
              <Button asChild size="sm" variant="default" className="flex-1 bg-[#003B7A] hover:bg-[#002B5A]">
                <a href={getTelHref(workshop.phone)}>
                  <Phone className="size-3.5" />
                  Ligar
                </a>
              </Button>
            )}
            {workshop.whatsapp && (
              <Button asChild size="sm" variant="default" className="flex-1 bg-[#009739] hover:bg-[#007a2e]">
                <a href={getWhatsAppHref(workshop.whatsapp)} target="_blank" rel="noopener noreferrer">
                  <Smartphone className="size-3.5" />
                  WhatsApp
                </a>
              </Button>
            )}
            {website && (
              <Button asChild size="icon-sm" variant="outline" className="shrink-0">
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visitar site de ${workshop.name}`}
                >
                  <ExternalLink className="size-3.5" />
                </a>
              </Button>
            )}
          </div>

          {workshop.coordinates && (
            <Button asChild size="sm" variant="ghost" className="h-8 w-full text-xs text-muted-foreground">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${workshop.coordinates.lat},${workshop.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Navigation className="size-3.5" />
                Como chegar
              </a>
            </Button>
          )}
        </div>
      </MarkerPopup>
    </MapMarker>
  );
}
