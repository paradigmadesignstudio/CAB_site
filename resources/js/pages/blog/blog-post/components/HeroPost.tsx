import { Calendar, Clock, User } from "lucide-react";
import { motion } from "framer-motion";
import { BlogCardImage } from "@/pages/blog/components/BlogCardImage";
import type { BlogPost } from "@/pages/blog/types";

interface HeroPostProps {
  post: BlogPost;
  showExcerpt?: boolean;
}

export function HeroPost({ post, showExcerpt = false }: HeroPostProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-[1.35rem] border-2 border-[#003B7A]/15 bg-white shadow-[0_24px_60px_-20px_rgba(0,59,122,0.35)] lg:grid lg:min-h-[min(60vh,520px)] lg:grid-cols-12">
        <div className="relative h-[min(52vw,380px)] lg:col-span-7 lg:h-full">
          <BlogCardImage
            image={post.image}
            mobileImage={post.imageMobile}
            alt={post.title}
            className="absolute inset-0 h-full w-full"
            imageClassName="transition-transform duration-700 group-hover:scale-[1.03]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#003B7A]/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#003B7A]/20" />
        </div>

        <div className="relative flex flex-col justify-center bg-gradient-to-br from-[#003B7A] via-[#002952] to-[#081A33] p-8 sm:p-10 lg:col-span-5 lg:p-12">
          <div className="pointer-events-none absolute -right-10 top-0 h-48 w-48 rounded-full bg-[#009739]/25 blur-[60px]" aria-hidden />
          <div className="pointer-events-none absolute -bottom-8 left-0 h-40 w-40 rounded-full bg-[#AFFF00]/15 blur-[50px]" aria-hidden />

          <span className="relative z-10 mb-3 inline-flex w-fit items-center rounded-full border border-[#AFFF00]/30 bg-[#AFFF00]/15 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#AFFF00]">
            {post.category}
          </span>

          <h1 className="relative z-10 text-2xl font-black leading-[1.1] tracking-tight text-white sm:text-3xl lg:text-4xl">
            {post.title}
          </h1>

          {showExcerpt && post.excerpt && (
            <p className="relative z-10 mt-4 line-clamp-4 text-sm leading-relaxed text-white/80 sm:text-base">
              {post.excerpt}
            </p>
          )}

          <div className="relative z-10 mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-white/80">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {post.author.name}
            </div>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {post.date}
            </div>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readTime} de leitura
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
