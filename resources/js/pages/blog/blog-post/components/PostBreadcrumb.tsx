import { Link } from "@inertiajs/react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { getBlogCategoryLink } from "@/pages/blog/lib/categoryLinks";
import type { BlogPost } from "@/pages/blog/types";

interface PostBreadcrumbProps {
  post: BlogPost;
}

export function PostBreadcrumb({ post }: PostBreadcrumbProps) {
  const categoryHref = getBlogCategoryLink(post.category);

  return (
    <nav
      aria-label="Navegação do artigo"
      className="border-b border-[#003B7A]/8 bg-[#FAFBFC]/90 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3 text-xs font-semibold sm:px-6 sm:text-sm">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-[#003B7A]/60 transition-colors hover:text-[#009739]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Blog
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-[#003B7A]/25" />
        <Link href={categoryHref} className="text-[#003B7A]/60 transition-colors hover:text-[#009739]">
          {post.category}
        </Link>
        <ChevronRight className="hidden h-3.5 w-3.5 text-[#003B7A]/25 sm:block" />
        <span className="hidden line-clamp-1 text-[#003B7A] sm:block">{post.title}</span>
      </div>
    </nav>
  );
}
