import { isPostNew } from "@/pages/blog/lib/postFreshness";

interface BlogPostNewBadgeProps {
  date: string;
  className?: string;
}

export function BlogPostNewBadge({ date, className = "" }: BlogPostNewBadgeProps) {
  if (!isPostNew(date)) {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border border-[#AFFF00]/40 bg-[#009739] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#AFFF00] ${className}`}
    >
      Novo
    </span>
  );
}
