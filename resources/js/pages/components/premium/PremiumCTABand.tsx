import { Link } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/pages/ui/button";
import { cn } from "@/lib/utils";

export interface PremiumCTABandProps {
  eyebrow: string;
  title: string;
  description: string;
  buttonText: string;
  link: string;
  className?: string;
  bandClassName?: string;
  externalLink?: boolean;
  centered?: boolean;
}

export function PremiumCTABand({
  eyebrow,
  title,
  description,
  buttonText,
  link,
  className,
  bandClassName,
  externalLink = false,
  centered = true,
}: PremiumCTABandProps) {
  const buttonClassName =
    "relative z-10 mt-8 h-12 rounded-xl bg-[#009739] px-8 font-bold text-white shadow-[0_8px_24px_-8px_rgba(0,151,57,0.6)] hover:bg-[#00b344]";

  return (
    <div className={cn("mx-auto max-w-4xl px-4 sm:px-6", centered && "text-center", className)}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={cn(
          "relative overflow-hidden rounded-[2rem] border-2 border-[#003B7A]/12 bg-gradient-to-br from-[#003B7A] via-[#002952] to-[#081A33] p-8 shadow-[0_24px_60px_-20px_rgba(0,59,122,0.45)] sm:p-12",
          bandClassName,
        )}
      >
        <div
          className="pointer-events-none absolute -right-10 top-0 h-48 w-48 rounded-full bg-[#009739]/25 blur-[60px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-8 left-0 h-40 w-40 rounded-full bg-[#AFFF00]/15 blur-[50px]"
          aria-hidden
        />

        <p className="relative z-10 mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#AFFF00]/80">
          {eyebrow}
        </p>
        <h2 className="relative z-10 text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl">
          {title}
        </h2>
        <p className="relative z-10 mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
          {description}
        </p>

        {externalLink ? (
          <a
            href={link}
            className={cn(
              buttonClassName,
              "inline-flex items-center gap-2 transition-all hover:-translate-y-0.5",
            )}
          >
            {buttonText}
            <ArrowRight className="h-4 w-4" />
          </a>
        ) : (
          <Button asChild className={buttonClassName}>
            <Link href={link} className="inline-flex items-center gap-2">
              {buttonText}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </motion.div>
    </div>
  );
}
