import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Calendar } from "lucide-react";
import type { ColumnistArticle } from "@/pages/blog/types";
import { CmsResponsiveImage } from "@/pages/components/CmsResponsiveImage";

interface ArticlesSliderProps {
  articles: ColumnistArticle[];
  isEven?: boolean;
  premium?: boolean;
}

export function ArticlesSlider({ articles, isEven = false, premium = false }: ArticlesSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkScroll();
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      }
    };
  }, [articles]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  const cardDetail = premium
    ? "text-[#009739]"
    : isEven
      ? "text-yellow-500"
      : "text-[#009739]";
  const buttonBg = premium
    ? "border-2 border-[#003B7A]/15 bg-white/95 text-[#003B7A] shadow-lg hover:bg-white"
    : isEven
      ? "bg-white/10 hover:bg-white/20 text-white"
      : "bg-gray-200 hover:bg-gray-300 text-gray-800";
  const cardBg = premium
    ? "rounded-[1.35rem] border-2 border-[#003B7A]/12 bg-white shadow-[0_12px_40px_-16px_rgba(0,59,122,0.2)] hover:border-[#009739]/35 hover:shadow-[0_20px_50px_-18px_rgba(0,59,122,0.3)]"
    : isEven
      ? "bg-gray-800/60 backdrop-blur-md border-gray-700/50 hover:border-gray-600"
      : "bg-white border-gray-200 hover:border-[#003A7B]/30 shadow-md";
  const cardText = premium ? "text-[#003B7A]" : isEven ? "text-white" : "text-[#003A7B]";
  const cardMuted = premium ? "text-[#003B7A]/65" : isEven ? "text-gray-400" : "text-gray-500";
  const cardMutedLight = premium ? "text-[#003B7A]/50" : isEven ? "text-gray-500" : "text-gray-400";

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className={`absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full p-2 backdrop-blur-md transition ${buttonBg}`}
          aria-label="Deslizar para esquerda"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className={`absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full p-2 backdrop-blur-md transition ${buttonBg}`}
          aria-label="Deslizar para direita"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth px-4 scrollbar-hide"
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
      >
        {articles.map((article) => (
          <a
            key={article.id}
            href={`/blog/${article.slug}`}
            className={`group flex w-[280px] shrink-0 snap-start flex-col overflow-hidden border transition-all sm:w-[320px] ${cardBg}`}
          >
            <div className="relative h-36 overflow-hidden bg-[#003B7A]/10">
              <CmsResponsiveImage
                image={article.image}
                mobileImage={article.imageMobile}
                alt={article.title}
                pictureClassName="absolute inset-0 block h-full w-full"
                imageClassName="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
            <div className="flex flex-1 flex-col p-4">
              {article.category && (
                <span className={`mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] ${cardDetail}`}>
                  {article.category}
                </span>
              )}
              <h4 className={`mb-2 line-clamp-2 text-sm font-bold transition-colors group-hover:text-[#009739] ${cardText}`}>
                {article.title}
              </h4>
              {article.excerpt && (
                <p className={`mb-3 line-clamp-2 text-xs ${cardMuted}`}>{article.excerpt}</p>
              )}
              <div className="mt-auto flex items-center justify-between border-t border-[#003B7A]/10 pt-3">
                <span className={`flex items-center gap-1 text-xs ${cardMutedLight}`}>
                  <Calendar className="h-3 w-3" /> {article.date}
                </span>
                <span className={`flex items-center gap-1 text-xs font-medium text-[#009739] opacity-0 transition-opacity group-hover:opacity-100`}>
                  Ler <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </a>
        ))}
        <div className="w-4 shrink-0" />
      </div>
    </div>
  );
}
