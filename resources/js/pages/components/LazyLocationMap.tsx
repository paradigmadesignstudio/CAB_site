"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";

const LocationMap = lazy(async () => {
  const module = await import("@/pages/components/LocationMap");
  return { default: module.LocationMap };
});

interface LazyLocationMapProps {
  latitude?: number | null;
  longitude?: number | null;
  addressQuery?: string;
  title?: string;
  className?: string;
}

function LocationMapFallback({ title, className }: { title: string; className?: string }) {
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

export function LazyLocationMap({
  latitude,
  longitude,
  addressQuery,
  title = "Localização no mapa",
  className,
}: LazyLocationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || mounted) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setMounted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: "320px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [mounted]);

  return (
    <div ref={containerRef}>
      {mounted ? (
        <Suspense fallback={<LocationMapFallback title={title} className={className} />}>
          <LocationMap
            latitude={latitude}
            longitude={longitude}
            addressQuery={addressQuery}
            title={title}
            className={className}
          />
        </Suspense>
      ) : (
        <LocationMapFallback title={title} className={className} />
      )}
    </div>
  );
}
