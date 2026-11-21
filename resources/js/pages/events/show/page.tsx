import Layout from "@/pages/layout";
import { Deferred, Link, usePage } from "@inertiajs/react";
import { DefaultHead } from "@/pages/components/layout/DefaultHead";
import { ChevronLeft } from "lucide-react";
import {
  EventPhotoGallerySection,
  EventPhotoGallerySectionFallback,
} from "./components/EventPhotoGallerySection";
import { EventDetailAbout } from "./components/EventDetailAbout";
import { EventDetailBlurBackdrop } from "./components/EventDetailBlurBackdrop";
import { EventDetailFixedColumns } from "./components/EventDetailFixedColumns";
import { EventDetailHeader } from "./components/EventDetailHeader";
import { EventDetailLocation } from "./components/EventDetailLocation";
import { EventDetailRelated } from "./components/EventDetailRelated";
import { EventDetailSchedule } from "./components/EventDetailSchedule";
import {
  absoluteUrl,
  buildEventJsonLd,
  isUsableSeoImage,
} from "@/lib/seo";
import type { AgendaEvent, AgendaEventDetail, AgendaGalleryImage } from "@/types/agenda";
import type { SeoSharedProps } from "@/types/seo";

interface EventShowPageProps {
  event: AgendaEventDetail;
  relatedEvents: AgendaEvent[];
  galleryImages?: AgendaGalleryImage[];
}

export default function EventShowPage({
  event,
  relatedEvents,
  galleryImages,
}: EventShowPageProps) {
  const { url } = usePage();
  const { appUrl, siteCompany } = usePage<SeoSharedProps>().props;
  const hasGallery = (event.galleryImageCount ?? galleryImages?.length ?? 0) > 0;

  const description = event.excerpt || event.description.join(" ").slice(0, 160);
  const imagePath = isUsableSeoImage(event.image) ? event.image : undefined;
  const canonical = appUrl
    ? absoluteUrl(appUrl, url.split("?")[0] || event.link || `/blog/eventos/${event.slug}`)
    : undefined;
  const image = imagePath && appUrl ? absoluteUrl(appUrl, imagePath) : undefined;

  const jsonLd =
    canonical
      ? buildEventJsonLd({
          name: event.title,
          description,
          url: canonical,
          image,
          startDate: event.date,
          locationName: event.venue?.name || event.location,
          locationAddress: event.venue
            ? `${event.venue.address}, ${event.venue.city} - ${event.venue.state}`
            : event.location,
          organizerName: event.organizer || siteCompany?.trade_name || "CAB",
        })
      : undefined;

  return (
    <Layout>
      <DefaultHead
        title={`${event.title} | Agenda CAB`}
        description={description}
        image={imagePath}
        jsonLd={jsonLd}
      />

      <div className="relative min-h-screen bg-[#003B7A] pb-14 font-sans text-white selection:bg-[#009739]/30 lg:pb-20">
        <EventDetailBlurBackdrop />

        <div className="relative z-20 border-b border-white/10 bg-[#003B7A]/85 px-4 py-2.5 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <Link
              href="/blog/eventos"
              className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/55 transition-colors hover:text-[#AFFF00]"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Voltar para eventos
            </Link>
          </div>
        </div>

        <div className="relative z-10">
          <div className="mx-auto max-w-6xl px-4 pb-14 pt-6 sm:px-6 sm:pb-16 sm:pt-8">
            <EventDetailFixedColumns event={event}>
              <EventDetailHeader event={event} />
              <EventDetailAbout event={event} />
              {event.schedule.length > 0 && <EventDetailSchedule schedule={event.schedule} />}

              {hasGallery && (
                <Deferred
                  data="galleryImages"
                  fallback={<EventPhotoGallerySectionFallback />}
                >
                  <EventPhotoGallerySection
                    images={galleryImages ?? []}
                    title={event.title}
                  />
                </Deferred>
              )}

              <EventDetailLocation venue={event.venue} />

              {relatedEvents.length > 0 && (
                <div className="border-t border-white/10 pt-14 sm:pt-16">
                  <EventDetailRelated events={relatedEvents} />
                </div>
              )}
            </EventDetailFixedColumns>
          </div>
        </div>
      </div>
    </Layout>
  );
}
