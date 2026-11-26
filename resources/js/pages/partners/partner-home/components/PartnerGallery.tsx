import { PremiumSectionHeader } from "@/pages/components/premium";

interface PartnerGalleryProps {
  images: string[];
}

export function PartnerGallery({ images }: PartnerGalleryProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <section>
      <PremiumSectionHeader label="Galeria" title="Imagens da marca" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((src) => (
          <img
            key={src}
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full rounded-[1.25rem] border border-[#003B7A]/10 object-cover"
          />
        ))}
      </div>
    </section>
  );
}
