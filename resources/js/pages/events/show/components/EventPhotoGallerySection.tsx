import { lazy, Suspense, useEffect, useRef, useState } from "react";

import type { AgendaGalleryImage } from "@/types/agenda";

const LAZY_MOUNT_ROOT_MARGIN = "128px";

const EventPhotoGallery = lazy(() =>
  import("./EventPhotoGallery").then((module) => ({
    default: module.EventPhotoGallery,
  })),
);

interface EventPhotoGallerySectionProps {
  images: AgendaGalleryImage[];
  title: string;
}

function GallerySectionFallback() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="h-3 w-32 rounded bg-[#003B7A]/10" />
          <div className="h-8 w-48 rounded bg-[#003B7A]/12" />
          <div className="h-4 w-36 rounded bg-[#003B7A]/8" />
        </div>
        <div className="h-9 w-40 rounded-full bg-[#003B7A]/8" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="aspect-[4/3] rounded-xl bg-[#003B7A]/8"
          />
        ))}
      </div>
    </div>
  );
}

export function EventPhotoGallerySectionFallback() {
  return (
    <div className="mt-14 overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#FAFBFC] px-5 pb-5 pt-5 sm:mt-16 sm:px-6 sm:pb-6 sm:pt-6">
      <GallerySectionFallback />
    </div>
  );
}

export function EventPhotoGallerySection({ images, title }: EventPhotoGallerySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      { rootMargin: LAZY_MOUNT_ROOT_MARGIN },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  if (images.length === 0) {
    return null;
  }

  return (
    <div
      ref={sectionRef}
      className="mt-14 overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#FAFBFC] px-5 pb-5 pt-5 sm:mt-16 sm:px-6 sm:pb-6 sm:pt-6"
    >
      {shouldMount ? (
        <Suspense fallback={<GallerySectionFallback />}>
          <EventPhotoGallery embedded images={images} title={title} />
        </Suspense>
      ) : (
        <GallerySectionFallback />
      )}
    </div>
  );
}
