import { useState } from "react";
import { cn } from "@/lib/utils";
import { isBlogImageUrl } from "@/lib/blogImage";
import { CmsResponsiveImage } from "@/pages/components/CmsResponsiveImage";

const FALLBACK_GRADIENT = "bg-gradient-to-br from-primary to-[#0E55B0]";

interface BlogCardImageProps {
  image?: string;
  mobileImage?: string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
  fallbackLabel?: string;
  /** Above-the-fold hero: eager load + alta prioridade de fetch (LCP). */
  priority?: boolean;
}

export function BlogCardImage({
  image,
  mobileImage,
  alt,
  className,
  imageClassName,
  fallbackLabel,
  priority = false,
}: BlogCardImageProps) {
  const [hasError, setHasError] = useState(false);
  const showImage = Boolean(image) && isBlogImageUrl(image!) && !hasError;
  const fallbackClass = image && !isBlogImageUrl(image) ? image : FALLBACK_GRADIENT;

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {showImage ? (
        <CmsResponsiveImage
          image={image!}
          mobileImage={mobileImage}
          alt={alt}
          pictureClassName="absolute inset-0 block h-full w-full"
          imageClassName={cn(
            "absolute inset-0 h-full w-full object-cover object-center",
            imageClassName,
          )}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding={priority ? "sync" : "async"}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className={cn("absolute inset-0", fallbackClass)} />
      )}

      {!showImage && fallbackLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/30 font-black text-xl uppercase tracking-widest">
            {fallbackLabel}
          </span>
        </div>
      )}
    </div>
  );
}
