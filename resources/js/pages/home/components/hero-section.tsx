import { Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Cab } from "@/components/Cab";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { INERTIA_PREFETCH_HOVER } from "@/lib/inertiaPrefetch";

/** Slides do hero — mobile ~800px; desktop ≤1920px. */
const eventImages = [
  {
    mobile: "/images/carousel/cab_carousel_1-mobile.webp",
    desktop: "/images/carousel/cab_carousel_1.webp",
    width: 1600,
    height: 1067,
  },
  {
    mobile: "/images/carousel/cab_carousel_2-mobile.webp",
    desktop: "/images/carousel/cab_carousel_2.webp",
    width: 1920,
    height: 1280,
  },
  {
    mobile: "/images/carousel/cab_carousel_3-mobile.webp",
    desktop: "/images/carousel/cab_carousel_3.webp",
    width: 1920,
    height: 1280,
  },
] as const;

const CAROUSEL_INTERVAL_MS = 5000;
/** Se a foto visível não disparar load, libera a próxima mesmo assim. */
const FIRST_SLIDE_FALLBACK_MS = 8000;

export function HeroSection() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allowNextSlide, setAllowNextSlide] = useState(false);
  const nextImageIndex = (currentImageIndex + 1) % eventImages.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % eventImages.length);
    }, CAROUSEL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setAllowNextSlide(true), FIRST_SLIDE_FALLBACK_MS);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!allowNextSlide) {
      return;
    }

    const next = eventImages[nextImageIndex];
    const urls = isMobile ? [next.mobile] : [next.desktop];

    for (const url of urls) {
      const preload = new Image();
      preload.src = url;
    }
  }, [allowNextSlide, isMobile, nextImageIndex]);

  return (
    <section
      id="hero"
      className="relative flex flex-col bg-white noise-overlay max-md:min-h-[calc(100dvh-6rem)] max-md:overflow-x-hidden md:min-h-[90vh] md:justify-center md:overflow-hidden"
    >
      <div className="relative z-0 max-md:min-h-[58dvh] max-md:flex-1 shrink-0 overflow-hidden bg-white md:absolute md:inset-0 md:h-full md:flex-none">
        {eventImages.map((image, index) => {
          const isCurrent = index === currentImageIndex;
          const isNext = index === nextImageIndex;

          if (!isCurrent && !(allowNextSlide && isNext)) {
            return null;
          }

          return (
            <div
              key={image.desktop}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isCurrent ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={!isCurrent}
            >
              <picture>
                <source
                  media="(max-width: 767px)"
                  srcSet={image.mobile}
                  type="image/webp"
                />
                <img
                  src={image.desktop}
                  alt={`Evento CAB ${index + 1}`}
                  width={image.width}
                  height={image.height}
                  className="h-full w-full object-cover object-[center_15%] md:object-center"
                  decoding={index === 0 ? "sync" : "async"}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "low"}
                  sizes="100vw"
                  onLoad={() => setAllowNextSlide(true)}
                  onError={() => setAllowNextSlide(true)}
                />
              </picture>
            </div>
          );
        })}

        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/5 via-transparent to-transparent md:hidden" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-white from-[9%] via-white/40 via-[90%] to-transparent md:hidden" />
        <div className="absolute inset-0 z-10 hidden md:block bg-gradient-to-l from-black/10 from-0% via-transparent via-35% to-transparent to-100%" />
        <div className="absolute inset-0 z-10 hidden md:block bg-gradient-to-t from-[#003B7A]/10 via-transparent to-transparent" />

        <div
          className="absolute inset-y-0 left-0 z-[15] hidden w-[48%] backdrop-blur-xl md:block lg:w-[54%] motion-reduce:backdrop-blur-none"
          aria-hidden
          style={{
            clipPath: "polygon(0 0, 100% 0, 76% 100%, 0 100%)",
            background:
              "linear-gradient(165deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.6) 42%, rgba(255, 255, 255, 0.3) 78%, rgba(255, 255, 255, 0.2) 100%)",
          }}
        />

        <div className="absolute bottom-[13.5rem] left-1/2 z-30 -translate-x-1/2 pointer-events-none md:hidden">
          <div className="flex h-10 w-6 animate-bounce justify-center rounded-full border-2 border-[#121212]/40 bg-white/50 pt-2 shadow-sm backdrop-blur-[2px]">
            <div className="h-2.5 w-1.5 rounded-full bg-[#121212]/60" />
          </div>
        </div>
      </div>

      <div
        className="absolute top-20 left-10 z-10 hidden h-32 w-32 rounded-full bg-[#AFFF00]/40 blur-3xl pointer-events-none md:block"
        aria-hidden
      />

      <div className="relative z-20 w-full max-w-7xl mx-auto max-md:shrink-0 md:absolute md:inset-0 md:flex md:items-center md:px-6 md:pb-12">
        <div className="w-full max-md:max-w-none max-w-3xl text-left">
          <div className="space-y-4 md:space-y-6 max-md:-mt-48 max-md:shrink-0 max-md:w-full max-md:rounded-t-[1.75rem] max-md:rounded-b-none max-md:border-0 max-md:bg-white max-md:px-5 max-md:pt-4 max-md:pb-[max(1.25rem,env(safe-area-inset-bottom))] max-md:shadow-[0_-8px_32px_-8px_rgba(0,59,122,0.08)] md:mt-0 md:rounded-none md:bg-transparent md:p-0 md:shadow-none">
            <div className="relative md:max-w-lg md:py-4 lg:max-w-2xl lg:py-6">
              <div className="hidden md:absolute md:-left-6 md:top-0 md:h-full md:w-[3px] md:rounded-full md:bg-gradient-to-b md:from-[#003B7A] md:via-[#009739] md:to-[#AFFF00]" aria-hidden />

              <div className="relative z-10 space-y-4 md:space-y-6 md:pl-2">
                <div className="inline-flex items-center gap-2 bg-[#121212] text-white px-3.5 py-2 rounded-full text-[10px] sm:text-xs font-mono tracking-wider shadow-lg">
                  <span className="h-2 w-2 rounded-full bg-[#AFFF00]" />
                  CÂMBIO AUTOMÁTICO DO BRASIL
                </div>

                <div className="space-y-3 md:space-y-4">
                  <h1 className="text-[#121212]">
                    <span className="block text-[2.35rem] leading-[0.95] font-black tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl md:leading-[0.9] md:drop-shadow-[0_1px_18px_rgba(255,255,255,0.85)]">
                      <span className="inline-block mr-3 sm:mr-5">SEJA</span>
                      <Cab className="inline-block text-[#003B7A]" />
                    </span>
                    <span className="mt-3 block max-w-md text-[15px] font-semibold leading-snug tracking-tight sm:text-xl md:mt-4 md:max-w-md md:text-xl lg:max-w-lg lg:text-2xl md:font-medium md:text-[#003B7A] md:drop-shadow-[0_1px_14px_rgba(255,255,255,0.75)]">
                      A maior comunidade de reparadores de transmissão automática do Brasil
                    </span>
                  </h1>
                </div>

                <div className="flex w-full flex-col gap-3 sm:w-auto md:max-w-sm md:pt-0">
                  <Link
                    href="/planos"
                    prefetch={INERTIA_PREFETCH_HOVER}
                    className="flex w-full items-center justify-center gap-1.5 rounded-full bg-[#319600] px-7 py-3.5 text-base font-bold tracking-wide text-[#FFFFFF] shadow-[0_14px_36px_-12px_rgba(49,150,0,0.45)] transition-transform hover:scale-105 active:scale-95 sm:w-auto md:px-5 md:py-2.5 md:text-sm"
                  >
                    <span>Conheça os planos</span>
                    <svg
                      className="h-4 w-4 md:h-3.5 md:w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>

                <div className="flex flex-row flex-wrap items-center gap-x-3 gap-y-2 border-t border-[#003B7A]/10 pb-1 pt-4 sm:gap-x-4 md:flex-nowrap md:pt-3 md:pb-0 lg:flex-wrap xl:flex-nowrap">
                  {["Conhecimento", "Conexões", "Resultados reais"].map((benefit) => (
                    <div
                      key={benefit}
                      className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[10px] font-bold uppercase tracking-wide text-[#121212] sm:text-[11px] md:text-[10px] md:tracking-[0.12em] md:text-[#003B7A]/70"
                    >
                      <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0E55B0] md:h-1 md:w-1 md:bg-[#009739]" />
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 z-30 hidden -translate-x-1/2 pointer-events-none md:block">
          <div className="flex h-10 w-6 animate-bounce justify-center rounded-full border-2 border-[#121212]/30 pt-2">
            <div className="h-2.5 w-1.5 rounded-full bg-[#121212]/50" />
          </div>
        </div>
      </div>
    </section>
  );
}
