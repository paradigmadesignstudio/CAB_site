import { useEffect } from "react";
import { BookOpen, Check, ChevronLeft, ChevronRight, Globe, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/pages/ui/dialog";
import { Button } from "@/pages/ui/button";
import { BlogCardImage } from "@/pages/blog/components/BlogCardImage";
import { cn } from "@/lib/utils";
import type { TrainingDetailItem } from "./training-types";

interface TrainingDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courses: TrainingDetailItem[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

const PLATFORM_ITEMS = [
  { key: "p1" as const, label: "Plataforma 1.4" },
  { key: "p2" as const, label: "Plataforma 2.0", highlight: true },
  { key: "p3" as const, label: "Plataforma 3.0" },
];

export function TrainingDetailModal({
  open,
  onOpenChange,
  courses,
  currentIndex,
  onNavigate,
}: TrainingDetailModalProps) {
  const course = courses[currentIndex];
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < courses.length - 1;

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && hasPrevious) {
        onNavigate(currentIndex - 1);
      }

      if (event.key === "ArrowRight" && hasNext) {
        onNavigate(currentIndex + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, currentIndex, hasPrevious, hasNext, onNavigate]);

  if (!course) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[92vh] gap-0 overflow-hidden rounded-[1.75rem] border-[#003B7A]/10 p-0 sm:max-w-2xl md:max-w-3xl"
      >
        <div className="relative">
          <BlogCardImage
            image={course.image}
            mobileImage={course.imageMobile}
            alt={course.label}
            className="aspect-[16/9] w-full rounded-none border-0"
            imageClassName="object-cover"
            fallbackLabel={course.n}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#003B7A]/80 via-[#003B7A]/10 to-transparent" />

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 inline-flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
            aria-label="Fechar detalhes do treinamento"
          >
            <X className="size-4" />
          </button>

          <div className="absolute right-4 bottom-4 left-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-white/70">
              Treinamento {course.n}
            </p>
            <DialogTitle className="mt-2 text-left text-xl font-black leading-tight text-white sm:text-2xl">
              {course.label}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Detalhes do treinamento {course.label}, incluindo idiomas, quantidade de aulas e planos disponíveis.
            </DialogDescription>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[#003B7A]/10 bg-[#003B7A]/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#003B7A]/70">
              {course.category}
            </span>
            <span className="rounded-full border border-[#009739]/15 bg-[#009739]/8 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#009739]">
              {course.lessonCount} {course.lessonCount === 1 ? "aula" : "aulas"}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#003B7A]/10 bg-[#FAFBFC] p-4">
              <div className="mb-3 flex items-center gap-2 text-[#003B7A]">
                <Globe className="size-4 text-[#009739]" />
                <p className="text-sm font-black">Idiomas disponíveis</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {course.languages.map((language) => (
                  <span
                    key={language}
                    className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#003B7A] shadow-sm ring-1 ring-[#003B7A]/10"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#003B7A]/10 bg-[#FAFBFC] p-4">
              <div className="mb-3 flex items-center gap-2 text-[#003B7A]">
                <BookOpen className="size-4 text-[#009739]" />
                <p className="text-sm font-black">Incluso nos planos</p>
              </div>
              <ul className="space-y-2">
                {PLATFORM_ITEMS.map((platform) => {
                  const included = course[platform.key];

                  return (
                    <li
                      key={platform.key}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3 py-2 text-sm",
                        platform.highlight ? "bg-[#009739]/8" : "bg-white",
                      )}
                    >
                      <span className="font-semibold text-[#003B7A]">{platform.label}</span>
                      {included ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#009739]">
                          <Check className="size-3.5" />
                          Incluso
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-[#003B7A]/40">Não incluso</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[#003B7A]/8 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onNavigate(currentIndex - 1)}
              disabled={!hasPrevious}
              className="h-11 flex-1 rounded-xl border-[#003B7A]/15 font-bold text-[#003B7A] hover:bg-[#003B7A]/5"
            >
              <ChevronLeft className="mr-1 size-4" />
              Anterior
            </Button>

            <p className="shrink-0 font-mono text-xs font-bold tabular-nums text-[#003B7A]/55">
              {currentIndex + 1} / {courses.length}
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={() => onNavigate(currentIndex + 1)}
              disabled={!hasNext}
              className="h-11 flex-1 rounded-xl border-[#003B7A]/15 font-bold text-[#003B7A] hover:bg-[#003B7A]/5"
            >
              Próximo
              <ChevronRight className="ml-1 size-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
