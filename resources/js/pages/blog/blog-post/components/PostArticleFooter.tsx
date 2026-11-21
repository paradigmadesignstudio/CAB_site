import { Link } from "@inertiajs/react";
import { ArrowRight, CalendarDays, Layers } from "lucide-react";
import { getBlogCategoryLink } from "@/pages/blog/lib/categoryLinks";
import type { BlogPost } from "@/pages/blog/types";

interface PostArticleFooterProps {
  post: BlogPost;
}

export function PostArticleFooter({ post }: PostArticleFooterProps) {
  const categoryHref = getBlogCategoryLink(post.category);

  return (
    <div className="rounded-xl border border-[#003B7A]/10 bg-white p-5 sm:p-6">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#003B7A]/45">
        Continue navegando
      </p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link
          href={categoryHref}
          className="group flex items-center justify-between gap-3 rounded-lg border border-[#003B7A]/10 px-4 py-3 transition-colors hover:border-[#009739]/35 hover:bg-[#009739]/[0.03]"
        >
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#009739]" />
            <span className="text-sm font-bold text-[#003B7A]">Mais em {post.category}</span>
          </div>
          <ArrowRight className="h-4 w-4 text-[#003B7A]/35 transition-transform group-hover:translate-x-0.5 group-hover:text-[#009739]" />
        </Link>
        <Link
          href="/blog/eventos"
          className="group flex items-center justify-between gap-3 rounded-lg border border-[#003B7A]/10 px-4 py-3 transition-colors hover:border-[#009739]/35 hover:bg-[#009739]/[0.03]"
        >
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[#009739]" />
            <span className="text-sm font-bold text-[#003B7A]">Agenda de eventos</span>
          </div>
          <ArrowRight className="h-4 w-4 text-[#003B7A]/35 transition-transform group-hover:translate-x-0.5 group-hover:text-[#009739]" />
        </Link>
        <Link
          href="/blog"
          className="group flex items-center justify-between gap-3 rounded-lg border border-[#003B7A]/10 px-4 py-3 transition-colors hover:border-[#009739]/35 hover:bg-[#009739]/[0.03]"
        >
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#009739]" />
            <span className="text-sm font-bold text-[#003B7A]">Portal do blog</span>
          </div>
          <ArrowRight className="h-4 w-4 text-[#003B7A]/35 transition-transform group-hover:translate-x-0.5 group-hover:text-[#009739]" />
        </Link>
      </div>
    </div>
  );
}
