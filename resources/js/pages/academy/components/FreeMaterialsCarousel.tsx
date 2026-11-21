import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Download, FileText } from "lucide-react";
import type { Material } from "@/pages/academy/types";
import { motion } from "framer-motion";
import { MaterialDownloadModal } from "@/pages/academy/components/MaterialDownloadModal";
import { useLightMotion } from "@/hooks/useLightMotion";
import { CmsResponsiveImage } from "@/pages/components/CmsResponsiveImage";

interface FreeMaterialsCarouselProps {
  materials: Material[];
}

export function FreeMaterialsCarousel({ materials }: FreeMaterialsCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const useStaticMotion = useLightMotion();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10,
    );
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScroll();
      container.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      }
    };
  }, [materials.length]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  function openDownloadModal(material: Material) {
    setSelectedMaterial(material);
    setModalOpen(true);
  }

  if (materials.length === 0) {
    return null;
  }

  return (
    <>
      <section id="materiais-gratuitos" className="relative overflow-hidden bg-gray-900 py-20 text-white">
        <div className="absolute inset-0 bg-[#003B7A]" />

        <div className="container relative z-10 mx-auto max-w-5xl px-4">
          {useStaticMotion ? (
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold tracking-tight">Materiais Gratuitos</h2>
              <p className="mx-auto max-w-xl text-gray-300">
                Conteúdos desenvolvidos por especialistas para elevar o nível técnico da sua oficina.
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
            >
              <h2 className="mb-4 text-4xl font-bold tracking-tight">Materiais Gratuitos</h2>
              <p className="mx-auto max-w-xl text-gray-300">
                Conteúdos desenvolvidos por especialistas para elevar o nível técnico da sua oficina.
              </p>
            </motion.div>
          )}
        </div>

        <div className="relative w-full">
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scroll("left")}
              className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-all hover:bg-white/20"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => scroll("right")}
              className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-all hover:bg-white/20"
              aria-label="Próximo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className="scrollbar-hide flex gap-8 overflow-x-auto scroll-smooth px-4 md:px-12"
            style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
          >
            {materials.map((material, index) =>
              useStaticMotion ? (
                <div
                  key={material.id}
                  className="group flex w-[300px] shrink-0 snap-center flex-col overflow-hidden rounded-2xl border border-gray-700/50 bg-gray-800/60 shadow-xl backdrop-blur-md transition-all hover:border-gray-600 hover:shadow-2xl sm:w-[340px]"
                >
                  <MaterialCardPreview material={material} priority={index < 2} />
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="mb-2 text-lg font-bold leading-tight text-white">{material.title}</h3>
                    <p className="mb-4 flex-1 text-sm text-gray-400">{material.description}</p>
                    <button
                      type="button"
                      onClick={() => openDownloadModal(material)}
                      className="group/link mt-auto inline-flex items-center gap-2 text-sm font-semibold text-blue-400 transition-colors hover:text-blue-300"
                    >
                      <Download className="h-4 w-4 transition-transform group-hover/link:translate-y-0.5" />
                      Baixar material
                    </button>
                  </div>
                </div>
              ) : (
                <motion.div
                  key={material.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4 }}
                  className="group flex w-[300px] shrink-0 snap-center flex-col overflow-hidden rounded-2xl border border-gray-700/50 bg-gray-800/60 shadow-xl backdrop-blur-md transition-all hover:border-gray-600 hover:shadow-2xl sm:w-[340px]"
                >
                  <MaterialCardPreview material={material} priority={index < 2} />
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="mb-2 text-lg font-bold leading-tight text-white">{material.title}</h3>
                    <p className="mb-4 flex-1 text-sm text-gray-400">{material.description}</p>
                    <button
                      type="button"
                      onClick={() => openDownloadModal(material)}
                      className="group/link mt-auto inline-flex items-center gap-2 text-sm font-semibold text-blue-400 transition-colors hover:text-blue-300"
                    >
                      <Download className="h-4 w-4 transition-transform group-hover/link:translate-y-0.5" />
                      Baixar material
                    </button>
                  </div>
                </motion.div>
              ),
            )}
            <div className="w-4 shrink-0 md:w-8" />
          </div>
        </div>
      </section>

      <MaterialDownloadModal material={selectedMaterial} open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}

function MaterialCardPreview({ material, priority = false }: { material: Material; priority?: boolean }) {
  return (
    <div className="relative h-44 w-full shrink-0 overflow-hidden border-b border-gray-700/50 bg-gray-800">
      {material.image ? (
        <CmsResponsiveImage
          image={material.image}
          mobileImage={material.imageMobile}
          alt={material.title}
          pictureClassName="block h-full w-full"
          imageClassName="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "low"}
          onError={(event) => {
            (event.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-400">
          <FileText className="h-12 w-12 text-[#009739]/70" aria-hidden />
          <span className="font-mono text-[10px] uppercase tracking-widest">PDF</span>
        </div>
      )}
    </div>
  );
}
