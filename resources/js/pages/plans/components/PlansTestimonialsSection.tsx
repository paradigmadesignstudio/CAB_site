import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/pages/ui/avatar";
import { PremiumSectionHeader } from "@/pages/components/premium";
import { cn } from "@/lib/utils";

interface Testimonial {
  name: string;
  office?: string;
  text: string;
  stars: number;
  initials: string;
}

interface TestimonialsSectionProps {
  title: string;
  subtitle: string;
  items: Testimonial[];
}

export function PlansTestimonialsSection({ title, subtitle, items }: TestimonialsSectionProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <PremiumSectionHeader title={title} description={subtitle} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:gap-7">
        {items.map((t) => (
          <article
            key={t.name}
            className={cn(
              "group relative flex h-full flex-col overflow-hidden rounded-[1.35rem]",
              "border-2 border-[#003B7A]/12 bg-white",
              "shadow-[0_12px_40px_-16px_rgba(0,59,122,0.15)]",
              "transition-[border-color,box-shadow,transform] duration-300",
              "hover:-translate-y-0.5 hover:border-[#009739]/25 hover:shadow-[0_20px_50px_-18px_rgba(0,59,122,0.22)]",
            )}
          >
            <div className="h-[3px] w-full bg-gradient-to-r from-[#009739] via-[#009739]/80 to-[#003B7A]/20" />

            <div className="flex flex-1 flex-col p-6 sm:p-7">
              <Quote
                className="mb-4 h-8 w-8 text-[#009739]/20 transition-colors duration-300 group-hover:text-[#009739]/35"
                aria-hidden
              />

              <div className="mb-4 flex gap-0.5" aria-label={`${t.stars} de 5 estrelas`}>
                {Array.from({ length: t.stars }, (_, s) => (
                  <Star key={s} className="h-4 w-4 fill-[#009739] text-[#009739]" />
                ))}
              </div>

              <blockquote className="flex-1 border-none p-0">
                <p className="text-sm leading-relaxed text-[#003B7A]/80 sm:text-[0.95rem] sm:leading-7">
                  &ldquo;{t.text}&rdquo;
                </p>
              </blockquote>

              <footer className="mt-6 flex items-center gap-3 border-t border-[#003B7A]/10 pt-5">
                <Avatar className="h-11 w-11 shrink-0 border-2 border-[#003B7A]/10">
                  <AvatarFallback className="bg-[#009739]/10 text-sm font-bold text-[#009739]">
                    {t.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#003B7A]">{t.name}</p>
                  {t.office && (
                    <p className="truncate text-xs text-[#003B7A]/55">{t.office}</p>
                  )}
                </div>
              </footer>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
