import { lazy, Suspense, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Map as MapIcon } from "lucide-react";
import { useLightMotion } from "@/hooks/useLightMotion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/pages/ui/collapsible";

const SupportCabMap = lazy(() =>
  import("@/pages/support/components/SupportCabMap").then((module) => ({
    default: module.SupportCabMap,
  })),
);

function MapLoadingFallback() {
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-sm text-white/50">Carregando mapa...</p>
    </div>
  );
}

export function MapSection() {
  const useStaticMotion = useLightMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && !hasBeenOpened) {
      setHasBeenOpened(true);
    }
  };

  return (
    <section className="bg-[#003B7A] py-16">
      <div className="container mx-auto max-w-5xl px-4">
        <motion.div
          initial={useStaticMotion ? false : { opacity: 0, y: 20 }}
          whileInView={useStaticMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={useStaticMotion ? undefined : { once: true, margin: "-100px" }}
          transition={useStaticMotion ? undefined : { duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-white">Onde Estamos</h2>
          <p className="mx-auto max-w-xl text-gray-300">
            Visite nosso escritório ou acompanhe sua equipe de campo.
          </p>
        </motion.div>

        <Collapsible
          open={isOpen}
          onOpenChange={handleOpenChange}
          className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
        >
          <div className="flex flex-col gap-3 bg-[#002952] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex items-center gap-2">
              <MapIcon className="h-5 w-5 text-white" />
              <span className="font-bold text-white">Mapa da sede CAB</span>
            </div>
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#009739] px-4 text-sm font-bold text-white shadow-[0_8px_20px_-10px_rgba(0,151,57,0.7)] transition-colors hover:bg-[#00b344]"
              >
                {isOpen ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Recolher mapa
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Ver no mapa
                  </>
                )}
              </button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent>
            <div className="aspect-video w-full bg-[#081A33]">
              {hasBeenOpened ? (
                <Suspense fallback={<MapLoadingFallback />}>
                  <SupportCabMap />
                </Suspense>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-white/50">Clique em &quot;Ver no mapa&quot; para carregar</p>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </section>
  );
}
