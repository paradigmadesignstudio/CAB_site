import { useMemo, useState, Fragment, useCallback } from "react";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { PlanCtaButton } from "@/pages/plans/components/PlanCtaButton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/pages/ui/table";
import { BlogCardImage } from "@/pages/blog/components/BlogCardImage";
import { cn } from "@/lib/utils";
import { TrainingDetailModal } from "./TrainingDetailModal";
import { planColumnShortLabel } from "@/pages/plans/lib/planDisplay";
import type { Plan } from "@/pages/plans/types";
import type { TrainingGroup, TrainingRow } from "./training-types";
import { fetchTrainingsTableGroups } from "@/pages/plans/services/trainingsTable";

export type { TrainingGroup, TrainingRow } from "./training-types";

type CellValue = boolean | string;

interface PlanSummary {
  plan: string;
  range: string;
  count: number;
  highlight: boolean;
}

export interface TrainingsTableMeta {
  title: string;
  description: string;
  planSummary: PlanSummary[];
  totalCount: number;
}

export interface TrainingsTableData extends TrainingsTableMeta {
  groups: TrainingGroup[];
}

interface TrainingsTableProps extends TrainingsTableMeta {
  plans: Plan[];
}

const INITIAL_ROWS_TO_SHOW = 10;

const renderCellContent = (value: CellValue) => {
  if (typeof value === "boolean") {
    return value
      ? <Check className="h-4 w-4 md:h-5 md:w-5 mx-auto text-secondary" />
      : <X className="h-3.5 w-3.5 md:h-4 md:w-4 mx-auto text-muted-foreground/30" />;
  }
  return null;
};

function getVisibleRows(groups: TrainingGroup[], isExpanded: boolean): TrainingGroup[] {
  if (isExpanded) {
    return groups;
  }

  let count = 0;
  const result: TrainingGroup[] = [];

  for (const group of groups) {
    const rows: TrainingRow[] = [];

    for (const row of group.rows) {
      if (count >= INITIAL_ROWS_TO_SHOW) {
        break;
      }
      rows.push(row);
      count++;
    }

    if (rows.length > 0) {
      result.push({ ...group, rows });
    }

    if (count >= INITIAL_ROWS_TO_SHOW) {
      break;
    }
  }

  return result;
}

function TrainingLabelCell({
  row,
  onOpen,
}: {
  row: TrainingRow;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex min-w-0 w-full items-center gap-3 rounded-lg text-left transition-colors hover:text-[#003B7A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009739]/40"
      aria-label={`Ver detalhes de ${row.label}`}
    >
      <BlogCardImage
        image={row.image}
        mobileImage={row.imageMobile}
        alt={row.label}
        className="hidden h-10 w-14 shrink-0 rounded-lg border border-[#003B7A]/10 sm:block"
        imageClassName="transition-transform duration-300 group-hover:scale-105"
        fallbackLabel={row.n}
      />
      <span className="min-w-0 break-words leading-snug underline-offset-2 group-hover:underline">
        {row.label}
      </span>
    </button>
  );
}

function PlanSummaryCards({ items }: { items: PlanSummary[] }) {
  const maxCount = Math.max(...items.map((item) => item.count), 1);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-5">
      {items.map((plan, index) => {
        const coverage = Math.round((plan.count / maxCount) * 100);

        return (
          <motion.article
            key={plan.plan}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.45 }}
            className={cn(
              "group relative flex min-h-[220px] flex-col rounded-[1.35rem] border bg-white/98 p-5 backdrop-blur-sm transition-all duration-300 md:min-h-[240px] md:p-7",
              plan.highlight
                ? "border-[#009739]/25 shadow-[0_24px_60px_-28px_rgba(0,151,57,0.55)] hover:border-[#009739]/40"
                : "border-white/35 shadow-[0_16px_48px_-24px_rgba(0,0,0,0.35)] hover:border-white/55",
            )}
          >
            {plan.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-[#009739]/20 bg-[#009739] px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-white shadow-[0_8px_20px_-10px_rgba(0,151,57,0.7)]">
                Recomendado
              </span>
            )}

            <div className="flex items-start justify-between gap-3">
              <p
                className={cn(
                  "text-sm font-black tracking-tight sm:text-base",
                  plan.highlight ? "text-[#009739]" : "text-[#003B7A]",
                )}
              >
                {plan.plan}
              </p>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 font-mono text-[10px] font-bold tabular-nums",
                  plan.highlight
                    ? "bg-[#009739]/10 text-[#009739]"
                    : "bg-[#003B7A]/6 text-[#003B7A]/50",
                )}
              >
                {coverage}%
              </span>
            </div>

            <div className="mt-6 flex items-end gap-0.5">
              <p
                className={cn(
                  "text-4xl font-black tabular-nums tracking-tighter sm:text-5xl",
                  plan.highlight ? "text-[#009739]" : "text-[#003B7A]",
                )}
              >
                {plan.count}
              </p>
              {index === items.length - 1 && plan.count >= 38 && (
                <span className="mb-1.5 text-lg font-bold text-[#003B7A]/25">+</span>
              )}
            </div>

            <p className="mt-1 text-sm font-medium text-[#003B7A]/65">módulos incluídos</p>
            <p className="mt-1 font-mono text-xs font-bold text-[#003B7A]/75">
              Faixa <span className="text-[#003B7A]">{plan.range}</span>
            </p>

            <div className="mt-auto pt-6">
              <div className="h-1 overflow-hidden rounded-full bg-[#003B7A]/8">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${coverage}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.08, duration: 0.7, ease: "easeOut" }}
                  className={cn(
                    "h-full rounded-full",
                    plan.highlight ? "bg-[#009739]" : "bg-[#003B7A]/30",
                  )}
                />
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}

export function TrainingsTable({ title, description, planSummary, totalCount, plans }: TrainingsTableProps) {
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTrainingIndex, setSelectedTrainingIndex] = useState(0);
  const [groups, setGroups] = useState<TrainingGroup[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [groupsLoaded, setGroupsLoaded] = useState(false);

  const ensureGroupsLoaded = useCallback(async () => {
    if (groupsLoaded || groupsLoading) {
      return;
    }

    setGroupsLoading(true);

    try {
      setGroups(await fetchTrainingsTableGroups());
      setGroupsLoaded(true);
    } finally {
      setGroupsLoading(false);
    }
  }, [groupsLoaded, groupsLoading]);

  const allTrainings = useMemo(
    () =>
      groups.flatMap((group) =>
        group.rows.map((row) => ({
          ...row,
          category: group.category,
          lessonCount: row.lessonCount ?? 0,
          languages: row.languages?.length ? row.languages : ["Português"],
        })),
      ),
    [groups],
  );

  const totalTrainings = totalCount;
  const hiddenTrainings = Math.max(0, totalTrainings - INITIAL_ROWS_TO_SHOW);
  const hasMoreTrainings = hiddenTrainings > 0;
  const visibleGroups = getVisibleRows(groups, isExpanded);

  const handleToggleTable = () => {
    setIsTableOpen((open) => {
      const nextOpen = !open;

      if (nextOpen) {
        void ensureGroupsLoaded();
      } else {
        setIsExpanded(false);
      }

      return nextOpen;
    });
  };

  const openTrainingDetails = (row: TrainingRow) => {
    const index = allTrainings.findIndex((training) => training.n === row.n && training.label === row.label);

    if (index === -1) {
      return;
    }

    setSelectedTrainingIndex(index);
    setIsDetailOpen(true);
  };

  return (
    <section className="relative overflow-hidden bg-[#003B7A] px-4 py-14 md:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "4rem 100%",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#009739]/15 blur-[90px]" aria-hidden />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-[#AFFF00]/10 blur-[80px]" aria-hidden />

      <div className="relative mx-auto w-full max-w-5xl">
        <div className="mb-10 text-center md:mb-14">
          <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            Biblioteca de treinamentos
          </p>
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl">
            {title}
          </h2>
          <div className="mx-auto mt-4 h-px w-14 bg-gradient-to-r from-transparent via-[#AFFF00]/70 to-transparent" />
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
            {description}
          </p>
        </div>

        <div className="mb-8 md:mb-10">
          <PlanSummaryCards items={planSummary} />
        </div>

        <div className="mb-4">
          <motion.button
            type="button"
            onClick={handleToggleTable}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/8 px-4 py-3.5 text-sm font-bold text-white/90 backdrop-blur-sm transition-colors hover:border-white/25 hover:bg-white/12"
            whileTap={{ scale: 0.98 }}
          >
            {isTableOpen ? (
              <>
                Ocultar lista de treinamentos
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Ver lista de treinamentos ({totalTrainings})
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </motion.button>
        </div>

        {isTableOpen && (
          <div className="overflow-x-auto rounded-[1.75rem] border border-white/15 bg-white/97 pr-2 shadow-[0_28px_70px_-30px_rgba(0,0,0,0.45)] backdrop-blur-xl md:pr-4">
            {groupsLoading && groups.length === 0 ? (
              <p className="px-6 py-10 text-center text-sm font-medium text-[#003B7A]/60">
                Carregando treinamentos...
              </p>
            ) : (
            <Table className="w-full min-w-[640px] table-fixed [&_thead_th:last-child]:!pr-6 [&_thead_th:last-child]:md:!pr-10">
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="hidden w-10 px-4 py-5 text-xs font-bold text-gray-900 sm:table-cell md:w-14 md:px-6">
                    #
                  </TableHead>
                  <TableHead className="w-[60%] px-4 py-5 text-xs font-bold text-gray-900 md:px-6 md:text-sm">
                    Treinamento
                  </TableHead>
                  {plans.map((plan) => (
                    <TableHead
                      key={plan.name}
                      className={cn(
                        "w-[12%] px-1 py-5 text-center text-xs md:text-sm",
                        plan.popular
                          ? "bg-primary/5 font-black text-secondary"
                          : "font-bold text-gray-900",
                      )}
                    >
                      <span className="hidden md:inline">Plataforma </span>
                      {planColumnShortLabel(plan)}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleGroups.map((group) => (
                  <Fragment key={`group-${group.category}`}>
                    <TableRow className="bg-gray-100">
                      <TableCell
                        colSpan={5}
                        className="px-4 md:px-6 py-3 text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-500"
                      >
                        {group.category}
                      </TableCell>
                    </TableRow>
                    {group.rows.map((r) => (
                      <TableRow key={r.n} className="group border-b border-gray-200">
                        <TableCell className="hidden px-4 py-3 font-mono text-[10px] text-gray-400 sm:table-cell md:px-6 md:text-xs">
                          {r.n}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-[11px] font-medium text-gray-700 md:px-6 md:text-sm">
                          <TrainingLabelCell row={r} onOpen={() => openTrainingDetails(r)} />
                        </TableCell>
                        <TableCell className="text-center px-1">{renderCellContent(r.p1)}</TableCell>
                        <TableCell className="text-center bg-primary/5 px-1">{renderCellContent(r.p2)}</TableCell>
                        <TableCell className="px-2 pr-6 text-center md:pr-10">{renderCellContent(r.p3)}</TableCell>
                      </TableRow>
                    ))}
                  </Fragment>
                ))}

                {!isExpanded && hasMoreTrainings && (
                  <TableRow className="border-none hover:bg-transparent bg-gray-50">
                    <TableCell colSpan={5} className="py-6">
                      <motion.button
                        type="button"
                        onClick={() => setIsExpanded(true)}
                        className="w-full flex items-center justify-center gap-2 text-secondary font-bold hover:opacity-80 transition-opacity"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>Ver mais {hiddenTrainings} treinamentos</span>
                        <ChevronDown className="h-5 w-5" />
                      </motion.button>
                    </TableCell>
                  </TableRow>
                )}

                {isExpanded && hasMoreTrainings && (
                  <TableRow className="border-none hover:bg-transparent bg-gray-50">
                    <TableCell colSpan={5} className="py-6">
                      <motion.button
                        type="button"
                        onClick={() => setIsExpanded(false)}
                        className="w-full flex items-center justify-center gap-2 text-secondary font-bold hover:opacity-80 transition-opacity"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>Ver menos</span>
                        <ChevronUp className="h-5 w-5" />
                      </motion.button>
                    </TableCell>
                  </TableRow>
                )}

                <TableRow className="border-none hover:bg-transparent">
                  <TableCell className="hidden sm:table-cell w-10 md:w-14 py-6 px-4 md:px-6" />
                  <TableCell className="w-[60%] py-6 px-4 md:px-6" />

                  {plans.map((plan) => (
                    <TableCell
                      key={plan.name}
                      className={cn(
                        "w-[12%] align-bottom px-0.5 py-6 text-center md:px-1",
                        plan.popular && "border-x border-primary/10 bg-primary/5",
                      )}
                    >
                      <PlanCtaButton
                        href={plan.href}
                        className={`w-full inline-flex items-center justify-center gap-1 font-semibold px-1 py-2 md:py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 text-[10px] sm:text-xs whitespace-normal sm:whitespace-nowrap leading-tight ${
                          plan.popular
                            ? "bg-secondary text-white hover:bg-secondary/90"
                            : "bg-[#003B7A] text-white hover:bg-[#002B5A]"
                        }`}
                      >
                        <span className="truncate">{plan.ctaText}</span>
                      </PlanCtaButton>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
            )}
          </div>
        )}
      </div>

      <TrainingDetailModal
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        courses={allTrainings}
        currentIndex={selectedTrainingIndex}
        onNavigate={setSelectedTrainingIndex}
      />
    </section>
  );
}
