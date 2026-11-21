import { Link } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";
import { BlogCardImage } from "@/pages/blog/components/BlogCardImage";
import type { BlogPost } from "@/pages/blog/types";

interface PostRelatedDenseProps {
  posts: BlogPost["relatedPosts"];
  categoryName: string;
}

export function PostRelatedDense({ posts, categoryName }: PostRelatedDenseProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-[#003B7A]/8 bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#009739]">
              Leitura complementar
            </p>
            <h2 className="text-xl font-black text-[#003B7A] sm:text-2xl">Você também pode gostar</h2>
            <p className="mt-1 text-sm text-[#003B7A]/60">
              Matérias relacionadas em {categoryName} e outras editorias do portal.
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden shrink-0 items-center gap-1.5 text-xs font-bold text-[#003B7A]/70 transition-colors hover:text-[#009739] sm:inline-flex"
          >
            Ver blog completo <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((relatedPost) => (
            <Link
              key={relatedPost.slug}
              href={`/blog/${relatedPost.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#003B7A]/12 bg-white transition-all hover:border-[#009739]/30 hover:shadow-[0_12px_32px_-20px_rgba(0,59,122,0.22)]"
            >
              <BlogCardImage
                image={relatedPost.image}
                mobileImage={relatedPost.imageMobile}
                alt={relatedPost.title}
                className="aspect-[16/10] w-full"
                imageClassName="transition-transform duration-500 group-hover:scale-[1.03]"
                fallbackLabel={categoryName.split(" ")[0]}
              />
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#009739]">
                  {relatedPost.date}
                </p>
                <h3 className="mt-2 line-clamp-3 flex-1 text-base font-black leading-snug text-[#003B7A] transition-colors group-hover:text-[#009739]">
                  {relatedPost.title}
                </h3>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#003B7A]/60 transition-colors group-hover:text-[#009739]">
                  Ler matéria <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
