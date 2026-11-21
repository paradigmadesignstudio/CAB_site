import { BlogNewsletterForm } from "@/pages/blog/components/BlogNewsletterForm";
import {
  getNewsletterCopy,
  resolveNewsletterTipo,
  type BlogEditorialContextKey,
} from "@/pages/blog/lib/blogEditorialContext";

interface BlogContextualNewsletterProps {
  context: BlogEditorialContextKey;
  categoryName?: string;
  className?: string;
}

export function BlogContextualNewsletter({
  context,
  categoryName,
  className = "",
}: BlogContextualNewsletterProps) {
  const copy = getNewsletterCopy(context);
  const tipo = resolveNewsletterTipo(context, categoryName);

  return (
    <section className={`mx-auto max-w-7xl px-4 py-8 sm:px-6 ${className}`}>
      <div className="rounded-2xl border border-[#003B7A]/12 bg-gradient-to-r from-[#003B7A] to-[#081A33] px-5 py-6 text-white sm:px-8 sm:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#AFFF00]/90">
              Newsletter CAB
            </p>
            <h3 className="mt-2 text-lg font-black sm:text-xl">{copy.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/75">{copy.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {copy.interests.map((interest) => (
                <span
                  key={interest}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/85"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7">
            <BlogNewsletterForm
              tipo={tipo}
              variant="compact"
              buttonLabel={copy.buttonLabel ?? "Quero receber"}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
