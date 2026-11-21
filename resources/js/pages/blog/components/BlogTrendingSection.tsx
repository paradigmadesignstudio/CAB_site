import { Link } from "@inertiajs/react";
import { ArrowRight, Flame } from "lucide-react";
import { Avatar, AvatarFallback } from "@/pages/ui/avatar";
import { BlogCardImage } from "@/pages/blog/components/BlogCardImage";
import { BlogPostNewBadge } from "@/pages/blog/components/BlogPostNewBadge";
import type { BlogRecentCard } from "@/pages/blog/types";

interface BlogTrendingSectionProps {
  posts: BlogRecentCard[];
}

export function BlogTrendingSection({ posts }: BlogTrendingSectionProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-[#003B7A]/8 bg-white py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.26em] text-[#009739]">
              <Flame className="h-3.5 w-3.5" />
              Em alta
            </p>
            <h2 className="text-xl font-black text-[#003B7A] sm:text-2xl">O que está em leitura agora</h2>
            <p className="mt-1 max-w-xl text-sm text-[#003B7A]/60">
              Matérias recentes e em destaque na comunidade CAB.
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden shrink-0 items-center gap-1.5 text-xs font-bold text-[#003B7A]/70 transition-colors hover:text-[#009739] sm:inline-flex"
          >
            Ver portal <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post, index) => (
            <Link
              key={post.id}
              href={post.link}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#003B7A]/12 bg-[#FAFBFC] transition-all hover:border-[#009739]/30 hover:bg-white hover:shadow-[0_12px_32px_-20px_rgba(0,59,122,0.22)]"
            >
              <div className="relative">
                <BlogCardImage
                  image={post.image}
                  mobileImage={post.imageMobile}
                  alt={post.title}
                  className="aspect-[16/10] w-full"
                  imageClassName="transition-transform duration-500 group-hover:scale-[1.03]"
                  fallbackLabel={post.category.split(" ")[0]}
                />
                <div className="absolute left-3 top-3 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#003B7A] font-mono text-xs font-black text-[#AFFF00]">
                    {index + 1}
                  </span>
                  <BlogPostNewBadge date={post.date} />
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#009739]">
                  {post.category}
                </p>
                <h3 className="mt-2 line-clamp-3 flex-1 text-sm font-bold leading-snug text-[#003B7A] transition-colors group-hover:text-[#009739] sm:text-base">
                  {post.title}
                </h3>
                <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#003B7A]/8 pt-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <Avatar className="h-6 w-6 shrink-0">
                      <AvatarFallback className="bg-[#003B7A]/8 text-[9px] font-bold text-[#003B7A]">
                        {post.authorInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate text-xs font-medium text-[#003B7A]/55">{post.author}</span>
                  </div>
                  <span className="text-[10px] font-medium text-[#003B7A]/45">{post.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
