import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, SearchX } from "lucide-react";
import { useLightMotion } from "@/hooks/useLightMotion";
import { Avatar, AvatarFallback } from "@/pages/ui/avatar";
import { BlogCardImage } from "@/pages/blog/components/BlogCardImage";
import type { BlogSearchItem } from "@/pages/blog/types";

interface BlogSearchResultsProps {
  results: BlogSearchItem[];
  query: string;
  layout?: "list" | "grid";
  categoryName?: string;
}

export function BlogSearchResults({
  results,
  query,
  layout = "list",
  categoryName,
}: BlogSearchResultsProps) {
  const useStaticMotion = useLightMotion();
  const normalizedQuery = query.trim();

  if (results.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="rounded-[1.35rem] border-2 border-dashed border-[#003B7A]/15 py-20 text-center">
          <SearchX className="mx-auto mb-4 h-12 w-12 text-[#003B7A]/40" />
          <h3 className="mb-2 text-2xl font-bold text-[#003B7A]">Nenhum resultado encontrado</h3>
          <p className="text-[#003B7A]/60">
            {normalizedQuery
              ? `Não encontramos artigos para "${normalizedQuery}". Tente outro termo.`
              : "Digite um termo para buscar artigos no blog."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto mb-20 max-w-7xl px-4 sm:px-6">
      <p className="mb-6 text-sm text-[#003B7A]/55">
        {results.length} {results.length === 1 ? "resultado" : "resultados"}
        {normalizedQuery ? ` para "${normalizedQuery}"` : ""}
      </p>

      {layout === "grid" ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {results.map((post, index) => (
            <motion.article
              key={post.id}
              initial={useStaticMotion ? false : { opacity: 0, y: 20 }}
              animate={useStaticMotion ? undefined : { opacity: 1, y: 0 }}
              transition={useStaticMotion ? undefined : { delay: index * 0.05 }}
              className="group flex flex-col overflow-hidden rounded-[1.35rem] border-2 border-[#003B7A]/12 bg-white shadow-[0_12px_40px_-16px_rgba(0,59,122,0.2)] transition-all duration-500 hover:border-[#009739]/35 hover:shadow-[0_20px_50px_-18px_rgba(0,59,122,0.3)]"
            >
              <Link href={post.link} className="block">
                <BlogCardImage
                  image={post.image}
                  mobileImage={post.imageMobile}
                  alt={post.title}
                  className="aspect-[16/10] w-full"
                  imageClassName="transition-transform duration-500 group-hover:scale-105"
                  fallbackLabel={(categoryName ?? post.category).split(" ")[0]}
                />
              </Link>
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#009739]">
                    {post.date}
                  </span>
                  {post.readTime && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-[#003B7A]/30" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#003B7A]/50">
                        {post.readTime}
                      </span>
                    </>
                  )}
                </div>
                <Link href={post.link} className="mb-4 block">
                  <h3 className="text-2xl font-bold leading-tight text-[#003B7A] transition-colors group-hover:text-[#009739]">
                    {post.title}
                  </h3>
                </Link>
                {post.excerpt && (
                  <p className="mb-8 line-clamp-3 flex-1 text-sm text-[#003B7A]/65">{post.excerpt}</p>
                )}
                <div className="mt-auto flex items-center justify-between border-t border-[#003B7A]/10 pt-6">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-[#003B7A]/8 text-[10px] font-bold text-[#003B7A]">
                        {post.authorInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-bold text-[#003B7A]/75">{post.author}</span>
                  </div>
                  <Link href={post.link} className="text-[#009739] transition-colors hover:text-[#00b344]">
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {results.map((post, index) => (
            <motion.article
              key={post.id}
              initial={useStaticMotion ? false : { opacity: 0, y: 10 }}
              animate={useStaticMotion ? undefined : { opacity: 1, y: 0 }}
              transition={useStaticMotion ? undefined : { delay: index * 0.04 }}
              className="group flex flex-col items-start gap-6 rounded-[1.35rem] border-2 border-[#003B7A]/12 bg-white p-5 shadow-[0_8px_30px_-14px_rgba(0,59,122,0.18)] transition-all duration-300 hover:border-[#009739]/30 hover:shadow-[0_16px_40px_-16px_rgba(0,59,122,0.25)] md:flex-row"
            >
              <Link href={post.link} className="w-full shrink-0 md:w-64">
                <BlogCardImage
                  image={post.image}
                  mobileImage={post.imageMobile}
                  alt={post.title}
                  className="h-48 w-full rounded-2xl border border-[#003B7A]/12 transition-colors group-hover:border-[#009739]/40 md:h-40"
                  fallbackLabel={post.category.split(" ")[0]}
                />
              </Link>
              <div className="flex flex-1 flex-col justify-center py-1">
                <div className="mb-2 flex items-center gap-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#009739]">
                    {post.category}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-[#003B7A]/30" />
                  <span className="text-xs text-[#003B7A]/55">{post.date}</span>
                </div>
                <Link href={post.link}>
                  <h4 className="mb-2 text-xl font-bold leading-snug text-[#003B7A] transition-colors group-hover:text-[#009739]">
                    {post.title}
                  </h4>
                </Link>
                {post.excerpt && (
                  <p className="mb-3 line-clamp-2 text-sm text-[#003B7A]/65">{post.excerpt}</p>
                )}
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="bg-[#003B7A]/8 text-[9px] font-bold text-[#003B7A]">
                        {post.authorInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-semibold text-[#003B7A]/60">{post.author}</span>
                  </div>
                  {post.readTime && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-[#003B7A]/50">
                      <Clock className="h-3.5 w-3.5" /> {post.readTime}
                    </div>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </section>
  );
}
