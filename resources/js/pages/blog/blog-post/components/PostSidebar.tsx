import { Link } from "@inertiajs/react";
import { ArrowRight, BookOpen, Calendar, Clock, GraduationCap, Layers, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/pages/ui/avatar";
import { getBlogCategoryLink, getBlogCategoryLinks } from "@/pages/blog/lib/categoryLinks";
import type { BlogPost } from "@/pages/blog/types";

interface PostSidebarProps {
  post: BlogPost;
}

export function PostSidebar({ post }: PostSidebarProps) {
  const categoryHref = getBlogCategoryLink(post.category);
  const exploreLinks = getBlogCategoryLinks(post.category).slice(0, 6);

  return (
    <aside className="space-y-4 lg:sticky lg:top-[11.5rem] lg:max-h-[calc(100dvh-12rem)] lg:overflow-y-auto">
      <div className="rounded-2xl border border-[#003B7A]/12 bg-white p-5 shadow-[0_8px_28px_-16px_rgba(0,59,122,0.18)]">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#009739]">
          Sobre esta matéria
        </p>

        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <User className="mt-0.5 h-4 w-4 shrink-0 text-[#003B7A]/45" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#003B7A]/45">Autor</p>
              <p className="font-bold text-[#003B7A]">{post.author.name}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-[#003B7A]/45" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#003B7A]/45">Publicado em</p>
              <p className="font-medium text-[#003B7A]/75">{post.date}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#003B7A]/45" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#003B7A]/45">Tempo de leitura</p>
              <p className="font-medium text-[#003B7A]/75">{post.readTime}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Layers className="mt-0.5 h-4 w-4 shrink-0 text-[#003B7A]/45" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#003B7A]/45">Editoria</p>
              <Link href={categoryHref} className="font-bold text-[#009739] transition-colors hover:text-[#00b344]">
                {post.category}
              </Link>
            </div>
          </div>
        </div>

        <Link
          href={categoryHref}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#003B7A]/12 px-4 py-2.5 text-xs font-bold text-[#003B7A] transition-colors hover:border-[#009739]/35 hover:text-[#009739]"
        >
          Ver mais em {post.category}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="rounded-2xl border border-[#003B7A]/12 bg-white p-5 shadow-[0_8px_28px_-16px_rgba(0,59,122,0.18)]">
        <p className="mb-3 flex items-center gap-2 text-sm font-black text-[#003B7A]">
          <BookOpen className="h-4 w-4 text-[#009739]" />
          Continue explorando
        </p>
        <div className="flex flex-wrap gap-2">
          {exploreLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex rounded-full border border-[#003B7A]/12 px-3 py-1.5 text-[11px] font-bold text-[#003B7A]/70 transition-colors hover:border-[#009739]/35 hover:text-[#009739]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[#003B7A]/12 bg-gradient-to-br from-[#003B7A] to-[#081A33] p-5 text-white shadow-[0_12px_32px_-18px_rgba(0,59,122,0.35)]">
        <div className="mb-3 inline-flex rounded-full bg-[#009739]/20 p-2">
          <GraduationCap className="h-5 w-5 text-[#AFFF00]" />
        </div>
        <p className="font-black">Aprofunde com a Academia CAB</p>
        <p className="mt-2 text-sm leading-relaxed text-white/75">
          Cursos e formação prática para aplicar o que você leu na oficina.
        </p>
        <Link
          href="/academia-cab"
          className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#AFFF00] transition-colors hover:text-white"
        >
          Conhecer cursos <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-[#003B7A]/12 bg-[#FAFBFC] p-4">
        <Avatar className="h-11 w-11 border border-[#003B7A]/10">
          <AvatarFallback className="bg-[#003B7A]/8 text-xs font-bold text-[#003B7A]">
            {post.author.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#003B7A]/45">Escrito por</p>
          <p className="truncate text-sm font-bold text-[#003B7A]">{post.author.name}</p>
        </div>
      </div>
    </aside>
  );
}
