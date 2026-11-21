import { Link } from "@inertiajs/react";
import { ArrowRight, Layers } from "lucide-react";
import { BlogCardImage } from "@/pages/blog/components/BlogCardImage";
import type { CategoryHighlight } from "@/pages/blog/lib/buildCategoryHighlights";

interface BlogCategoryHighlightsSectionProps {
  highlights: CategoryHighlight[];
}

export function BlogCategoryHighlightsSection({ highlights }: BlogCategoryHighlightsSectionProps) {
  if (highlights.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6">
          <p className="mb-1 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.26em] text-[#009739]">
            <Layers className="h-3.5 w-3.5" />
            Explorar por editoria
          </p>
          <h2 className="text-xl font-black text-[#003B7A] sm:text-2xl">Temas em destaque</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {highlights.map(({ category, post }) => (
            <article
              key={category.link}
              className="group flex flex-col overflow-hidden rounded-xl border border-[#003B7A]/12 bg-white transition-all hover:border-[#009739]/30 hover:shadow-[0_12px_32px_-20px_rgba(0,59,122,0.22)]"
            >
              <Link href={post.link} className="block">
                <BlogCardImage
                  image={post.image}
                  mobileImage={post.imageMobile}
                  alt={post.title}
                  className="aspect-[16/9] w-full"
                  imageClassName="transition-transform duration-500 group-hover:scale-[1.03]"
                  fallbackLabel={category.name.split(" ")[0]}
                />
              </Link>
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#009739]">
                  {category.name}
                </p>
                <Link href={post.link}>
                  <h3 className="mt-2 line-clamp-2 text-base font-black leading-snug text-[#003B7A] transition-colors group-hover:text-[#009739]">
                    {post.title}
                  </h3>
                </Link>
                <p className="mt-2 text-xs font-medium text-[#003B7A]/45">{post.date}</p>
                <Link
                  href={category.link}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#003B7A]/70 transition-colors hover:text-[#009739]"
                >
                  Ver editoria <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
