import type { ImgHTMLAttributes, ReactEventHandler } from "react";
import { cn } from "@/lib/utils";

interface CmsResponsiveImageProps {
  image: string;
  mobileImage?: string | null;
  alt: string;
  pictureClassName?: string;
  imageClassName?: string;
  loading?: "eager" | "lazy";
  decoding?: "sync" | "async" | "auto";
  fetchPriority?: "high" | "low" | "auto";
  referrerPolicy?: ImgHTMLAttributes<HTMLImageElement>["referrerPolicy"];
  onError?: ReactEventHandler<HTMLImageElement>;
}

export function CmsResponsiveImage({
  image,
  mobileImage,
  alt,
  pictureClassName,
  imageClassName,
  loading = "lazy",
  decoding = "async",
  fetchPriority,
  referrerPolicy,
  onError,
}: CmsResponsiveImageProps) {
  const hasMobileVariant = Boolean(mobileImage) && mobileImage !== image;

  return (
    <picture className={cn(hasMobileVariant && "block", pictureClassName)}>
      {hasMobileVariant && <source media="(max-width: 767px)" srcSet={mobileImage!} />}
      <img
        src={image}
        alt={alt}
        className={imageClassName}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        referrerPolicy={referrerPolicy}
        onError={onError}
      />
    </picture>
  );
}
