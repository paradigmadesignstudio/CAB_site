import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@inertiajs/react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

interface DirectoryEntityCardProps {
  name: string;
  logo: string;
  detailHref: string;
  detailLabel: string;
  badge?: ReactNode;
  logoBadge?: ReactNode;
  /** Substitui o `<img>` padrão do logotipo (ex.: placeholder customizado). */
  logoMedia?: ReactNode;
  body?: ReactNode;
  footerExtra?: ReactNode;
  externalHref?: string;
  index?: number;
  titleClassName?: string;
}

export function DirectoryEntityCard({
  name,
  logo,
  detailHref,
  detailLabel,
  badge,
  logoBadge,
  logoMedia,
  body,
  footerExtra,
  externalHref,
  index = 0,
  titleClassName = "line-clamp-2",
}: DirectoryEntityCardProps) {
  const reduceMotion = useReducedMotion();
  const isCoarsePointer = useMediaQuery("(pointer: coarse)");
  const useLightMotion = reduceMotion || isCoarsePointer;

  const cardClassName =
    "group flex h-full flex-col overflow-hidden rounded-[1.35rem] border-2 border-[#003B7A]/12 bg-white shadow-[0_12px_40px_-16px_rgba(0,59,122,0.2)] transition-all duration-300 hover:border-[#009739]/35 hover:shadow-[0_20px_50px_-18px_rgba(0,59,122,0.3)]";

  const cardBody = (
    <>
      <div className="relative flex h-32 items-center justify-center border-b border-[#003B7A]/8 bg-[#FAFBFC] p-4">
        {logoBadge && (
          <div className="absolute right-3 top-3 z-10" aria-hidden={false}>
            {logoBadge}
          </div>
        )}
        {logoMedia ?? (
          <img
            src={logo}
            alt={name}
            loading="lazy"
            decoding="async"
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3
            className={cn(
              "text-base font-black tracking-tight text-[#003B7A] transition-colors group-hover:text-[#009739] sm:text-lg",
              titleClassName,
            )}
          >
            {name}
          </h3>
          {badge}
        </div>

        {body}

        <div className="mt-auto flex flex-col gap-2">
          {footerExtra}

          <Link
            href={detailHref}
            className={cn(
              "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#003B7A] px-4 text-sm font-bold text-white",
              "shadow-[0_8px_24px_-10px_rgba(0,59,122,0.45)] transition-all hover:-translate-y-0.5 hover:bg-[#002B5A]",
            )}
          >
            {detailLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          {externalHref && (
            <a
              href={externalHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#003B7A]/12 px-4 text-xs font-bold text-[#003B7A]/75 transition-colors hover:border-[#009739]/30 hover:text-[#009739]"
            >
              Site oficial
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </>
  );

  if (useLightMotion) {
    return <article className={cardClassName}>{cardBody}</article>;
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.45 }}
      className={cardClassName}
    >
      {cardBody}
    </motion.article>
  );
}

interface DirectoryEntityGridProps<T extends { id: number | string }> {
  items: T[];
  renderCard: (item: T, index: number) => ReactNode;
  pageSize?: number;
  loadMoreLabel?: string;
}

export function DirectoryEntityGrid<T extends { id: number | string }>({
  items,
  renderCard,
  pageSize = 24,
  loadMoreLabel = "Carregar mais resultados",
}: DirectoryEntityGridProps<T>) {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [items, pageSize]);

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
        {visibleItems.map((item, index) => renderCard(item, index))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + pageSize)}
            className="inline-flex h-11 items-center justify-center rounded-xl border-2 border-[#003B7A]/15 bg-white px-6 text-sm font-bold text-[#003B7A] transition-colors hover:border-[#009739]/35 hover:text-[#009739]"
          >
            {loadMoreLabel} ({items.length - visibleCount} restantes)
          </button>
        </div>
      )}
    </div>
  );
}
