import { cn } from "@/lib/utils";

interface AgendaEventImageProps {
  src: string;
  alt: string;
  className?: string;
  overlay?: boolean;
}

export function AgendaEventImage({ src, alt, className, overlay = false }: AgendaEventImageProps) {
  return (
    <div className={cn("relative overflow-hidden bg-[#003B7A]/10", className)}>
      <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
      {overlay && <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />}
    </div>
  );
}
