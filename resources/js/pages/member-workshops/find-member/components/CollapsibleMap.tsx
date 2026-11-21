"use client";

import { lazy, Suspense, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/pages/ui/collapsible";
import { Map as MapIcon, ChevronDown, ChevronUp } from "lucide-react";
import type { Workshop } from "@/pages/member-workshops/types";

const WorkshopMap = lazy(() =>
  import("./WorkshopMap").then((module) => ({
    default: module.WorkshopMap,
  })),
);

interface CollapsibleMapProps {
  workshops: Workshop[];
}

function MapLoadingFallback() {
  return (
    <div className="flex h-full items-center justify-center bg-[#FAFBFC]">
      <p className="text-sm text-[#003B7A]/50">Carregando mapa...</p>
    </div>
  );
}

export function CollapsibleMap({ workshops }: CollapsibleMapProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && !hasBeenOpened) {
      setHasBeenOpened(true);
    }
  };

  const locatedCount = workshops.filter((w) => w.coordinates).length;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={handleOpenChange}
      className="w-full overflow-hidden rounded-[1.35rem] border-2 border-[#003B7A]/12 bg-white shadow-[0_12px_40px_-16px_rgba(0,59,122,0.2)]"
    >
      <div className="flex flex-col gap-3 bg-[#003B7A] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-center gap-2">
          <MapIcon className="h-5 w-5 text-white" />
          <span className="font-bold text-white">Mapa de oficinas</span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/55">
            ({locatedCount} localizadas)
          </span>
        </div>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#009739] px-4 text-sm font-bold text-white shadow-[0_8px_20px_-10px_rgba(0,151,57,0.7)] transition-colors hover:bg-[#00b344]"
          >
            {isOpen ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Recolher
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Expandir mapa
              </>
            )}
          </button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="transition-all data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
        {hasBeenOpened ? (
          <div className="h-[450px] w-full">
            <Suspense fallback={<MapLoadingFallback />}>
              <WorkshopMap workshops={workshops} />
            </Suspense>
          </div>
        ) : (
          <div className="flex h-[450px] w-full items-center justify-center bg-[#FAFBFC]">
            <p className="text-sm text-[#003B7A]/50">Clique em &quot;Expandir mapa&quot; para carregar</p>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
