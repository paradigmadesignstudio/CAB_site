import { Link } from "@inertiajs/react";
import { ArrowRight, Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/pages/ui/avatar";
import { Button } from "@/pages/ui/button";
import { BlogCardImage } from "@/pages/blog/components/BlogCardImage";
import { BlogPostNewBadge } from "@/pages/blog/components/BlogPostNewBadge";
import { BlogDenseMetaLine } from "@/pages/blog/components/dense/BlogDenseSections";
import type {
  BlogColumnist,
  BlogFeaturedCard,
  BlogRecentCard,
  BlogSubFeaturedCard,
} from "@/pages/blog/types";

/** Teste visual: altere para `2` ou `3` colunas nos secundários abaixo do destaque. */
export const INDEX_SECONDARY_GRID_COLUMNS: 2 | 3 = 3;

export const indexSecondaryGridClassName =
  INDEX_SECONDARY_GRID_COLUMNS === 3
    ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    : "grid grid-cols-1 gap-4 sm:grid-cols-2";

export function BlogIndexSecondaryMosaicCard({ post }: { post: BlogSubFeaturedCard }) {
  return (
    <Link
      href={post.link}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#003B7A]/12 bg-white shadow-[0_6px_24px_-14px_rgba(0,59,122,0.2)] transition-all hover:border-[#009739]/35 hover:shadow-[0_12px_32px_-14px_rgba(0,59,122,0.28)]"
    >
      <BlogCardImage
        image={post.image}
        mobileImage={post.imageMobile}
        alt={post.title}
        className="aspect-[16/10] w-full shrink-0"
        imageClassName="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
        fallbackLabel={post.category.split(" ")[0]}
      />
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <BlogDenseMetaLine category={post.category} date={post.date} className="mb-0" />
          <BlogPostNewBadge date={post.date} />
        </div>
        <h3 className="line-clamp-3 flex-1 text-base font-bold leading-snug text-[#003B7A] transition-colors group-hover:text-[#009739]">
          {post.title}
        </h3>
        <div className="mt-3 flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-[#003B7A]/8 text-[9px] font-bold text-[#003B7A]">
              {post.authorInitials}
            </AvatarFallback>
          </Avatar>
          <span className="truncate text-xs font-medium text-[#003B7A]/55">{post.author}</span>
        </div>
      </div>
    </Link>
  );
}

export function BlogIndexFeaturedMosaic({ post }: { post: BlogFeaturedCard }) {
  return (
    <Link
      href={post.link}
      className="group block overflow-hidden rounded-2xl border border-[#003B7A]/15 bg-white shadow-[0_16px_48px_-18px_rgba(0,59,122,0.35)] transition-shadow hover:shadow-[0_20px_56px_-18px_rgba(0,59,122,0.42)]"
    >
      <div className="flex flex-col lg:grid lg:min-h-[min(58vh,520px)] lg:grid-cols-12">
        <div className="relative h-[min(52vw,380px)] shrink-0 sm:h-[min(48vw,420px)] lg:col-span-7 lg:h-full lg:min-h-[420px]">
          <BlogCardImage
            image={post.image}
            mobileImage={post.imageMobile}
            alt={post.title}
            className="absolute inset-0 h-full w-full"
            imageClassName="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03] lg:object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#003B7A]/45 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#003B7A]/15" />
        </div>

        <div className="relative flex flex-col justify-center bg-gradient-to-br from-[#003B7A] via-[#002952] to-[#081A33] p-5 sm:p-6 lg:col-span-5 lg:p-8">
          <span className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-[#AFFF00]/35 bg-[#AFFF00]/15 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#AFFF00]">
            Destaque
            <BlogPostNewBadge date={post.date} className="border-white/25 bg-white/10 text-[#AFFF00]" />
          </span>
          <BlogDenseMetaLine
            category={post.category}
            date={post.date}
            readTime={post.readTime}
            tone="onDark"
            className="mb-3"
          />
          <h2 className="text-xl font-black leading-tight tracking-tight text-white transition-colors group-hover:text-[#AFFF00] sm:text-2xl lg:text-3xl">
            {post.title}
          </h2>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/75 sm:text-base">{post.excerpt}</p>
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-white/80">
            <Avatar className="h-7 w-7 border border-white/20">
              <AvatarFallback className="bg-[#009739] text-[9px] font-bold text-white">
                {post.authorInitials}
              </AvatarFallback>
            </Avatar>
            <span>{post.author}</span>
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export function BlogIndexSidebarLatest({ posts }: { posts: BlogRecentCard[] }) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-[#003B7A]/12 bg-white p-4 shadow-[0_8px_28px_-16px_rgba(0,59,122,0.18)]">
      <h3 className="mb-4 border-b border-[#003B7A]/10 pb-3 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#003B7A]/55">
        Últimas publicações
      </h3>
      <ol className="space-y-3">
        {posts.map((post, index) => (
          <li key={post.id}>
            <Link href={post.link} className="group flex gap-3">
              <span className="mt-0.5 w-5 shrink-0 font-mono text-sm font-black text-[#009739]/80">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-bold leading-snug text-[#003B7A] transition-colors group-hover:text-[#009739]">
                  {post.title}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-[11px] font-medium text-[#003B7A]/45">{post.date}</p>
                  <BlogPostNewBadge date={post.date} />
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function BlogIndexSidebarColumnists({ columnists }: { columnists: BlogColumnist[] }) {
  if (columnists.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-[#003B7A]/12 bg-white p-4 shadow-[0_8px_28px_-16px_rgba(0,59,122,0.18)]">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-black text-[#003B7A]">
        <Star className="h-4 w-4 fill-[#AFFF00] text-[#AFFF00]" />
        Colunistas CAB
      </h3>
      <div className="space-y-3">
        {columnists.map((col, index) => (
          <div key={`${col.name}-${index}`} className="group flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-[#003B7A]/12 transition-colors group-hover:border-[#009739]/40">
              <AvatarFallback className="bg-[#003B7A]/5 text-xs font-bold text-[#003B7A]">
                {col.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[#003B7A] transition-colors group-hover:text-[#009739]">
                {col.name}
              </p>
              <p className="truncate text-xs text-[#003B7A]/50">{col.role}</p>
            </div>
          </div>
        ))}
      </div>
      <Button
        asChild
        variant="ghost"
        className="mt-4 h-9 w-full text-xs font-bold text-[#009739] hover:bg-[#009739]/5"
      >
        <Link href="/blog/colunistas-cab">
          Ver todos <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Link>
      </Button>
    </div>
  );
}
