import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import { Link } from "@inertiajs/react";
import { BookOpen, ChevronRight, Globe, PlayCircle } from "lucide-react";
import { PremiumSectionHeader } from "@/pages/components/premium";
import { BlogCardImage } from "@/pages/blog/components/BlogCardImage";
import { Button } from "@/pages/ui/button";
import type { TrainingsTableMeta } from "@/pages/plans/components/TrainingsTable";
import type { TrainingDetailItem, TrainingGroup, TrainingRow } from "@/pages/plans/components/training-types";
import type { AcademyTrainingsSectionContent } from "@/pages/academy/types";
import { AcademyTrainingsCatalog } from "@/pages/academy/components/AcademyTrainingsCatalog";
import { shuffleArray } from "@/lib/shuffleArray";
import { cn } from "@/lib/utils";

const TrainingDetailModal = lazy(() =>
  import("@/pages/plans/components/TrainingDetailModal").then((module) => ({
    default: module.TrainingDetailModal,
  })),
);

interface AcademyTrainingsSectionProps {
  content: AcademyTrainingsSectionContent;
  meta: TrainingsTableMeta;
  groups: TrainingGroup[];
}

function minimumPlanShortLabel(row: TrainingRow): string {
  if (row.p1) {
    return "Plataforma 1.4";
  }

  if (row.p2) {
    return "Plataforma 2.0";
  }

  return "Plataforma 3.0";
}

function flattenTrainings(groups: TrainingGroup[]): TrainingDetailItem[] {
  return groups.flatMap((group) =>
    group.rows.map((row) => ({
      ...row,
      category: group.category,
      lessonCount: row.lessonCount ?? 0,
      languages: row.languages?.length ? row.languages : ["Português"],
    })),
  );
}

function TrainingStatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-[#003B7A]/10 bg-white/95 p-4 text-center shadow-[0_12px_32px_-20px_rgba(0,59,122,0.35)] backdrop-blur-sm sm:p-5">
      <p className="text-2xl font-black tabular-nums tracking-tight text-[#003B7A] sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#003B7A]/55">{label}</p>
    </div>
  );
}

function TrainingCard({
  training,
  onOpen,
}: {
  training: TrainingDetailItem;
  onOpen: () => void;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-[#003B7A]/12 bg-white shadow-[0_16px_40px_-24px_rgba(0,59,122,0.35)] transition-all duration-300 hover:border-[#009739]/30 hover:shadow-[0_24px_50px_-22px_rgba(0,151,57,0.25)]">
      <button
        type="button"
        onClick={onOpen}
        className="relative block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009739]/40"
        aria-label={`Ver detalhes de ${training.label}`}
      >
        <BlogCardImage
          image={training.image}
          mobileImage={training.imageMobile}
          alt={training.label}
          className="aspect-[16/10] w-full rounded-none border-0"
          imageClassName="transition-transform duration-500 group-hover:scale-105"
          fallbackLabel={training.n}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#003B7A]/75 via-transparent to-transparent opacity-80" />
        <span className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/20 bg-black/35 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
          #{training.n}
        </span>
        <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-[#003B7A] shadow-sm">
          <PlayCircle className="size-3.5 text-[#009739]" />
          {training.lessonCount} {training.lessonCount === 1 ? "aula" : "aulas"}
        </span>
      </button>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#009739]/80">
          {training.category}
        </p>
        <h3 className="mb-3 line-clamp-3 text-base font-black leading-snug text-[#003B7A]">{training.label}</h3>

        <div className="mt-auto flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#003B7A]/6 px-2.5 py-1 text-[10px] font-bold text-[#003B7A]/75">
            <Globe className="size-3" />
            {training.languages[0]}
            {training.languages.length > 1 ? ` +${training.languages.length - 1}` : ""}
          </span>
          <span className="rounded-full bg-[#009739]/10 px-2.5 py-1 text-[10px] font-bold text-[#009739]">
            {minimumPlanShortLabel(training)}
          </span>
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#009739] transition-colors hover:text-[#00b344]"
        >
          Ver conteúdo do treinamento
          <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </article>
  );
}

export function AcademyTrainingsSection({ content, meta, groups }: AcademyTrainingsSectionProps) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const allTrainings = useMemo(() => flattenTrainings(groups), [groups]);
  const featuredTrainings = useMemo(
    () => shuffleArray(allTrainings).slice(0, Math.max(1, content.featuredCount)),
    [allTrainings, content.featuredCount],
  );

  const totalLessons = useMemo(
    () => allTrainings.reduce((sum, training) => sum + (training.lessonCount ?? 0), 0),
    [allTrainings],
  );

  const languageCount = useMemo(() => {
    const languages = new Set<string>();

    allTrainings.forEach((training) => {
      training.languages.forEach((language) => languages.add(language));
    });

    return languages.size;
  }, [allTrainings]);

  const openTrainingAtIndex = useCallback((index: number) => {
    if (index < 0 || index >= allTrainings.length) {
      return;
    }

    setSelectedIndex(index);
    setDetailOpen(true);
  }, [allTrainings.length]);

  const openTrainingDetails = useCallback(
    (training: TrainingDetailItem) => {
      const index = allTrainings.findIndex(
        (item) => item.n === training.n && item.label === training.label,
      );

      if (index === -1) {
        return;
      }

      openTrainingAtIndex(index);
    },
    [allTrainings, openTrainingAtIndex],
  );

  if (meta.totalCount <= 0 || featuredTrainings.length === 0) {
    return null;
  }

  return (
    <section id="treinamentos-plataforma" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <PremiumSectionHeader
        label={content.label}
        title={`${content.title} ${content.titleHighlight}`}
        description={content.description}
        className="text-center [&_h2]:mx-auto [&_p]:mx-auto"
      />

      {content.evolutionNote && (
        <div className="mx-auto mb-8 mt-6 max-w-2xl rounded-2xl border border-[#009739]/20 bg-[#009739]/[0.06] px-5 py-4 text-center sm:mt-8 sm:px-6 sm:py-5">
          <p className="text-sm font-bold tracking-tight text-[#003B7A] sm:text-base">
            {content.evolutionNote.title}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-[#003B7A]/70">
            {content.evolutionNote.description}
          </p>
        </div>
      )}

      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:mb-10 lg:grid-cols-4">
        <TrainingStatCard value={`+${meta.totalCount}`} label="Treinamentos" />
        <TrainingStatCard
          value={totalLessons > 0 ? `${totalLessons}+` : "—"}
          label="Aulas gravadas"
        />
        <TrainingStatCard
          value={languageCount > 0 ? String(languageCount) : "—"}
          label="Idiomas"
        />
        <TrainingStatCard value="Online" label="Acesso 24h" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {featuredTrainings.map((training) => (
          <TrainingCard
            key={`${training.n}-${training.label}`}
            training={training}
            onOpen={() => openTrainingDetails(training)}
          />
        ))}
      </div>

      {allTrainings.length > content.featuredCount && (
        <AcademyTrainingsCatalog
          trainings={allTrainings}
          catalog={content.catalog}
          onOpenAtIndex={openTrainingAtIndex}
        />
      )}

      <div className="mt-10 flex flex-col items-center gap-3 text-center sm:mt-12">
        <p className="max-w-xl text-sm text-[#003B7A]/65">
          Biblioteca completa com montagem, desmontagem e diagnóstico de transmissões automáticas e automatizadas.
          {meta.totalCount > content.featuredCount
            ? ` ${meta.totalCount} treinamentos disponíveis no catálogo acima.`
            : null}
        </p>
        <Button
          asChild
          className={cn(
            "h-11 rounded-xl bg-[#009739] px-6 font-bold text-white shadow-[0_12px_30px_-14px_rgba(0,151,57,0.8)]",
            "hover:bg-[#00b344]",
          )}
        >
          <Link href={content.cta.href}>
            {content.cta.label}
            <ChevronRight className="ml-1 size-4" />
          </Link>
        </Button>
      </div>

      {detailOpen && (
        <Suspense fallback={null}>
          <TrainingDetailModal
            open={detailOpen}
            onOpenChange={setDetailOpen}
            courses={allTrainings}
            currentIndex={selectedIndex}
            onNavigate={setSelectedIndex}
          />
        </Suspense>
      )}
    </section>
  );
}
