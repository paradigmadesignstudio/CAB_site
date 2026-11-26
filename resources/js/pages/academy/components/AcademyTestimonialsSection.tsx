import { Quote } from "lucide-react";
import { motion } from "framer-motion";
import { useLightMotion } from "@/hooks/useLightMotion";
import type { Testimonial } from "@/pages/academy/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/pages/ui/avatar";
import { cn } from "@/lib/utils";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

function testimonialInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AcademyTestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const light = useLightMotion();
  if (testimonials.length === 0) {
    return null;
  }

  const centerLastOdd =
    testimonials.length % 2 === 1 ? "last:md:col-span-2 last:md:mx-auto last:md:max-w-xl" : "";

  return (
    <section className="bg-[#003B7A] py-16 text-white sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          initial={light ? false : { opacity: 0, y: 20 }}
          whileInView={light ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: light ? 0 : 0.5 }}
          className="mb-10 text-center sm:mb-12"
        >
          <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#AFFF00]/80">
            Depoimentos
          </p>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">O que dizem nossos alunos</h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.id}
              initial={light ? false : { opacity: 0, y: 20 }}
              whileInView={light ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: light ? 0 : 0.4, delay: light ? 0 : index * 0.08 }}
              className={cn(
                "flex h-full flex-col rounded-2xl border border-white/12 bg-white/8 p-6 shadow-[0_16px_48px_-24px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-7",
                centerLastOdd,
              )}
            >
              <Quote className="mb-4 h-7 w-7 text-[#AFFF00]/35" aria-hidden />

              <blockquote className="flex-1 border-none p-0">
                <p className="text-sm leading-relaxed text-white/85 sm:text-[0.95rem] sm:leading-7">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
              </blockquote>

              <footer className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                <Avatar className="h-11 w-11 shrink-0 border-2 border-white/15">
                  {testimonial.avatar ? (
                    <AvatarImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                  <AvatarFallback className="bg-[#009739]/20 text-sm font-bold text-[#AFFF00]">
                    {testimonialInitials(testimonial.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">{testimonial.name}</p>
                  <p className="truncate text-xs text-white/60">{testimonial.role}</p>
                </div>
              </footer>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
