import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/pages/ui/dialog";
import { Button } from "@/pages/ui/button";
import { cn } from "@/lib/utils";
import type { AgendaGalleryImage } from "@/types/agenda";

const INITIAL_BATCH = 6;
const LOAD_MORE_BATCH = 6;
const GRID_LAZY_ROOT_MARGIN = "64px";

interface EventPhotoGalleryProps {
  images: AgendaGalleryImage[];
  title: string;
  /** Título da seção (H2). Default: "Galeria do evento". */
  heading?: string;
  /** Quando embutida em card (ex.: página do evento), remove espaçamento superior duplicado. */
  embedded?: boolean;
}

interface GalleryGridImageProps {
  src: string;
  alt: string;
  canLoad: boolean;
  className?: string;
  onLoaded: () => void;
}

function GalleryGridImage({ src, alt, canLoad, className, onLoaded }: GalleryGridImageProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [src, canLoad]);

  return (
    <div className="absolute inset-0">
      {!loaded && (
        <div
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#E8EDF3] via-[#F4F7FA] to-[#E0E7F0]"
          aria-hidden
        />
      )}
      {canLoad ? (
        <img
          src={src}
          alt={alt}
          decoding="async"
          loading="lazy"
          fetchPriority="low"
          onLoad={() => {
            setLoaded(true);
            onLoaded();
          }}
          className={cn(
            className,
            "transition-opacity duration-300 ease-out",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      ) : null}
    </div>
  );
}

function GalleryLightbox({
  open,
  onOpenChange,
  images,
  title,
  activeIndex,
  onIndexChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: AgendaGalleryImage[];
  title: string;
  activeIndex: number;
  onIndexChange: (index: number) => void;
}) {
  const [imageReady, setImageReady] = useState(false);
  const activeImage = images[activeIndex]?.full ?? "";
  const hasPrevious = activeIndex > 0;
  const hasNext = activeIndex < images.length - 1;
  const progress = ((activeIndex + 1) / images.length) * 100;

  useEffect(() => {
    setImageReady(false);
  }, [activeImage]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[96vh] gap-0 overflow-hidden rounded-2xl border border-[#003B7A]/15 bg-white p-0 shadow-xl sm:max-w-5xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#003B7A]/10 bg-[#003B7A] px-5 py-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <DialogTitle className="line-clamp-2 text-left text-lg font-bold text-white sm:text-xl">
              {title}
            </DialogTitle>
            <DialogDescription className="mt-1 text-left text-xs text-white/60">
              Foto {activeIndex + 1} de {images.length}
            </DialogDescription>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-[#009739] transition-[width] duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10"
            aria-label="Fechar galeria"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="bg-[#F4F7FA] px-4 py-5 sm:px-6 sm:py-6">
          <div className="relative mx-auto flex min-h-[min(50vh,480px)] max-w-4xl items-center justify-center">
            {hasPrevious && (
              <button
                type="button"
                onClick={() => onIndexChange(activeIndex - 1)}
                className="absolute left-0 z-20 hidden size-11 -translate-x-1/2 items-center justify-center rounded-full border border-[#003B7A]/15 bg-white text-[#003B7A] shadow-md hover:text-[#009739] sm:inline-flex"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="size-5" />
              </button>
            )}

            <div className="relative w-full overflow-hidden rounded-xl border border-[#003B7A]/12 bg-[#081A33]">
              <div className="relative flex min-h-[min(48vh,460px)] items-center justify-center p-3 sm:p-4">
                {!imageReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0E1F38]">
                    <div className="h-9 w-9 animate-pulse rounded-full border-2 border-[#009739]/30 border-t-[#009739]" />
                  </div>
                )}

                {open && (
                  <img
                    key={activeImage}
                    src={activeImage}
                    alt={`${title} — foto ${activeIndex + 1}`}
                    decoding="async"
                    onLoad={() => setImageReady(true)}
                    className={cn(
                      "max-h-[min(48vh,460px)] w-full object-contain transition-opacity duration-200",
                      imageReady ? "opacity-100" : "opacity-0",
                    )}
                  />
                )}
              </div>
            </div>

            {hasNext && (
              <button
                type="button"
                onClick={() => onIndexChange(activeIndex + 1)}
                className="absolute right-0 z-20 hidden size-11 translate-x-1/2 items-center justify-center rounded-full border border-[#003B7A]/15 bg-white text-[#003B7A] shadow-md hover:text-[#009739] sm:inline-flex"
                aria-label="Próxima foto"
              >
                <ChevronRight className="size-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[#003B7A]/8 bg-white px-4 py-4 sm:px-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onIndexChange(activeIndex - 1)}
            disabled={!hasPrevious}
            className="h-11 flex-1 rounded-xl border-[#003B7A]/15 font-bold text-[#003B7A] hover:bg-[#003B7A]/5 disabled:opacity-40"
          >
            <ChevronLeft className="mr-1 size-4" />
            Anterior
          </Button>

          <p className="hidden shrink-0 font-mono text-xs font-bold tabular-nums tracking-widest text-[#003B7A]/55 sm:block">
            {String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </p>

          <Button
            type="button"
            variant="outline"
            onClick={() => onIndexChange(activeIndex + 1)}
            disabled={!hasNext}
            className="h-11 flex-1 rounded-xl border-[#003B7A]/15 font-bold text-[#003B7A] hover:bg-[#003B7A]/5 disabled:opacity-40"
          >
            Próxima
            <ChevronRight className="ml-1 size-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function EventPhotoGallery({
  images,
  title,
  heading = "Galeria do evento",
  embedded = false,
}: EventPhotoGalleryProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH);
  const [gridCanLoad, setGridCanLoad] = useState(false);
  const [loadThroughIndex, setLoadThroughIndex] = useState(-1);
  const gridRef = useRef<HTMLDivElement>(null);

  const visibleImages = images.slice(0, visibleCount);
  const hasMoreToShow = visibleCount < images.length;

  const openAt = (index: number) => {
    setActiveIndex(index);
    setOpen(true);
  };

  const handleImageLoaded = useCallback((index: number) => {
    setLoadThroughIndex((current) => Math.max(current, index + 1));
  }, []);

  useEffect(() => {
    const grid = gridRef.current;

    if (!grid) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGridCanLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: GRID_LAZY_ROOT_MARGIN },
    );

    observer.observe(grid);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (gridCanLoad && loadThroughIndex < 0) {
      setLoadThroughIndex(0);
    }
  }, [gridCanLoad, loadThroughIndex]);

  useEffect(() => {
    if (!open || images.length === 0) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && activeIndex > 0) {
        setActiveIndex((current) => current - 1);
      }

      if (event.key === "ArrowRight" && activeIndex < images.length - 1) {
        setActiveIndex((current) => current + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, activeIndex, images.length]);

  if (images.length === 0) {
    return null;
  }

  return (
    <section
      className={cn(
        embedded ? "mt-0 border-0 pt-0" : "mt-12 border-t border-[#003B7A]/10 pt-12",
      )}
    >
      <div className={cn("flex flex-wrap items-end justify-between gap-4", embedded ? "mb-6" : "mb-8")}>
        <div>
          <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#009739]">
            Registro fotográfico
          </p>
          <h2 className="text-2xl font-black tracking-tight text-[#003B7A] sm:text-3xl">
            {heading}
          </h2>
          <p className="mt-2 text-sm text-[#003B7A]/60">
            {images.length} foto{images.length === 1 ? "" : "s"} de {title}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#003B7A]/12 bg-[#FAFBFC] px-4 py-2 text-xs font-semibold text-[#003B7A]/70">
          <Images className="h-4 w-4 text-[#009739]" />
          Clique para ampliar
        </div>
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
      >
        {visibleImages.map((image, index) => (
          <button
            key={`${image.full}-${index}`}
            type="button"
            onClick={() => openAt(index)}
            className={cn(
              "group relative aspect-[4/3] overflow-hidden rounded-xl border-2 border-[#003B7A]/10 bg-[#FAFBFC]",
              "shadow-[0_8px_24px_-12px_rgba(0,59,122,0.25)] transition-[border-color,box-shadow,transform] duration-300",
              "hover:-translate-y-0.5 hover:border-[#009739]/35 hover:shadow-[0_16px_32px_-14px_rgba(0,59,122,0.35)]",
              "[content-visibility:auto] [contain-intrinsic-size:240px]",
            )}
          >
            <GalleryGridImage
              src={image.thumb}
              alt={`${title} — foto ${index + 1}`}
              canLoad={gridCanLoad && loadThroughIndex >= index}
              onLoaded={() => handleImageLoaded(index)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#003B7A]/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="absolute bottom-2 right-2 rounded-full bg-white/90 px-2 py-0.5 font-mono text-[10px] font-bold text-[#003B7A] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {index + 1}
            </span>
          </button>
        ))}
      </div>

      {hasMoreToShow && (
        <div className="mt-8 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => setVisibleCount((count) => Math.min(count + LOAD_MORE_BATCH, images.length))}
            className="h-11 rounded-xl border-[#003B7A]/20 px-6 font-bold text-[#003B7A] hover:border-[#009739]/35 hover:bg-[#009739]/5 hover:text-[#009739]"
          >
            Carregar mais fotos
          </Button>
          <p className="text-xs text-[#003B7A]/55">
            Exibindo {visibleImages.length} de {images.length}
          </p>
        </div>
      )}

      <GalleryLightbox
        open={open}
        onOpenChange={setOpen}
        images={images}
        title={title}
        activeIndex={activeIndex}
        onIndexChange={setActiveIndex}
      />
    </section>
  );
}
