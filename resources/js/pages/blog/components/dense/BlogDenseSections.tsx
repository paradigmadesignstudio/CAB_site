import { Link } from "@inertiajs/react";
import { ArrowRight, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/pages/ui/avatar";
import { BlogCardImage } from "@/pages/blog/components/BlogCardImage";
import { BlogPostNewBadge } from "@/pages/blog/components/BlogPostNewBadge";
import { LoadMoreButton } from "@/pages/blog/components/LoadMoreButton";
import type { BlogFeaturedCard, BlogRecentCard } from "@/pages/blog/types";

export function BlogDenseMetaLine({
  category,
  date,
  readTime,
  className = "",
  tone = "default",
}: {
  category: string;
  date?: string;
  readTime?: string;
  className?: string;
  tone?: "default" | "onDark";
}) {
  const isOnDark = tone === "onDark";

  return (
    <div className={`flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wide ${className}`}>
      <span
        className={`font-mono text-[10px] tracking-[0.16em] ${isOnDark ? "text-[#AFFF00]" : "text-[#009739]"}`}
      >
        {category}
      </span>
      {date && (
        <>
          <span className={`h-1 w-1 rounded-full ${isOnDark ? "bg-white/35" : "bg-[#003B7A]/25"}`} />
          <span className={isOnDark ? "text-white/75" : "text-[#003B7A]/50"}>{date}</span>
        </>
      )}
      {readTime && (
        <>
          <span className={`h-1 w-1 rounded-full ${isOnDark ? "bg-white/35" : "bg-[#003B7A]/25"}`} />
          <span
            className={`inline-flex items-center gap-1 ${isOnDark ? "text-white/70" : "text-[#003B7A]/45"}`}
          >
            <Clock className="h-3 w-3" />
            {readTime}
          </span>
        </>
      )}
    </div>
  );
}

export function BlogDenseFeaturedMosaic({ post }: { post: BlogFeaturedCard }) {
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
          <span className="mb-2 inline-flex w-fit rounded-full border border-[#AFFF00]/35 bg-[#AFFF00]/15 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#AFFF00]">
            Destaque
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

function DenseFeedCard({ post }: { post: BlogRecentCard }) {
  return (
    <article className="group flex gap-4 border-b border-[#003B7A]/10 py-4 last:border-b-0">
      <Link href={post.link} className="w-28 shrink-0 sm:w-32">
        <BlogCardImage
          image={post.image}
          mobileImage={post.imageMobile}
          alt={post.title}
          className="aspect-[4/3] w-full rounded-lg border border-[#003B7A]/10 transition-colors group-hover:border-[#009739]/35"
          fallbackLabel={post.category.split(" ")[0]}
        />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <BlogDenseMetaLine category={post.category} date={post.date} readTime={post.readTime} className="mb-0" />
          <BlogPostNewBadge date={post.date} />
        </div>
        <Link href={post.link}>
          <h4 className="line-clamp-3 text-base font-bold leading-snug text-[#003B7A] transition-colors group-hover:text-[#009739] sm:text-lg">
            {post.title}
          </h4>
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <Avatar className="h-5 w-5">
            <AvatarFallback className="bg-[#003B7A]/8 text-[8px] font-bold text-[#003B7A]">
              {post.authorInitials}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-[#003B7A]/55">{post.author}</span>
        </div>
      </div>
    </article>
  );
}

export function BlogDenseFeedSection({
  posts,
  eyebrow = "Feed editorial",
  title = "Todas as publicações",
  totalCount,
  hasMore,
  loading,
  onLoadMore,
  loadMoreLabel = "Carregar mais artigos",
  revealLabel = "Ver publicações do arquivo",
}: {
  posts: BlogRecentCard[];
  eyebrow?: string;
  title?: string;
  totalCount?: number;
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  loadMoreLabel?: string;
  revealLabel?: string;
}) {
  if (!hasMore && posts.length === 0) {
    return null;
  }

  const isRevealState = posts.length === 0 && hasMore;
  const buttonLabel = isRevealState ? revealLabel : loadMoreLabel;

  return (
    <section className="border-t border-[#003B7A]/8 bg-[#FAFBFC] py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#003B7A]/45">
              {eyebrow}
            </p>
            <h2 className="text-xl font-black text-[#003B7A] sm:text-2xl">{title}</h2>
            {isRevealState && totalCount !== undefined && totalCount > 0 && (
              <p className="mt-2 text-sm text-[#003B7A]/60">
                {totalCount} {totalCount === 1 ? "matéria disponível" : "matérias disponíveis"} no arquivo.
              </p>
            )}
          </div>
          {!isRevealState && totalCount !== undefined && (
            <p className="hidden text-xs font-medium text-[#003B7A]/45 sm:block">{totalCount} matérias</p>
          )}
        </div>

        {posts.length > 0 && (
          <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
            {posts.map((post) => (
              <DenseFeedCard key={post.id} post={post} />
            ))}
          </div>
        )}

        <LoadMoreButton
          label={buttonLabel}
          hasMore={hasMore}
          loading={loading}
          onClick={onLoadMore}
          className={
            posts.length > 0
              ? "mt-8 h-12 w-full rounded-xl border-2 border-[#003B7A]/12 text-sm font-bold text-[#003B7A] hover:border-[#009739]/35 hover:bg-white"
              : "h-12 w-full rounded-xl border-2 border-[#003B7A]/12 text-sm font-bold text-[#003B7A] hover:border-[#009739]/35 hover:bg-white"
          }
        />
      </div>
    </section>
  );
}
