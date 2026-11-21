import { useMemo } from "react";
import { ArrowRight, BookOpen, Layers, Lock } from "lucide-react";
import { PremiumSectionHeader } from "@/pages/components/premium";
import { BlogCardImage } from "@/pages/blog/components/BlogCardImage";
import { Button } from "@/pages/ui/button";
import { ASSOCIATE_AREA_LINK_PROPS } from "@/pages/components/layout/data/navigation";
import type {
  AcademyPlatformMaterialCard,
  AcademyPlatformMaterialsSectionContent,
  AcademyPlatformMaterialsSectionData,
} from "@/pages/academy/types";
import { AcademyPlatformMaterialsCatalog } from "@/pages/academy/components/AcademyPlatformMaterialsCatalog";

interface AcademyPlatformMaterialsSectionProps {
  content: AcademyPlatformMaterialsSectionContent;
  meta: AcademyPlatformMaterialsSectionData["meta"];
  featured: AcademyPlatformMaterialCard[];
  categories: AcademyPlatformMaterialsSectionData["categories"];
}

function FeaturedMaterialCard({
  material,
  exclusiveBadge,
}: {
  material: AcademyPlatformMaterialCard;
  exclusiveBadge: string;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-[#003B7A]/12 bg-white shadow-[0_16px_40px_-24px_rgba(0,59,122,0.35)] transition-all duration-300 hover:border-[#009739]/30 hover:shadow-[0_24px_50px_-22px_rgba(0,151,57,0.25)]">
      <a
        {...ASSOCIATE_AREA_LINK_PROPS}
        className="relative block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009739]/40"
      >
        <BlogCardImage
          image={material.image}
          mobileImage={material.imageMobile}
          alt={material.title}
          className="aspect-[16/10] w-full rounded-none border-0"
          imageClassName="transition-transform duration-500 group-hover:scale-105"
          fallbackLabel="CAB"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#003B7A]/80 via-[#003B7A]/10 to-transparent" />
        <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/35 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
          <Lock className="size-3" />
          {exclusiveBadge}
        </span>
      </a>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#009739]/80">
          {material.category}
        </p>
        <h3 className="mb-4 line-clamp-3 text-base font-black leading-snug text-[#003B7A]">
          {material.title}
        </h3>

        <a
          {...ASSOCIATE_AREA_LINK_PROPS}
          className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-[#009739] transition-colors hover:text-[#00b344]"
        >
          Área do Assinante
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </article>
  );
}

export function AcademyPlatformMaterialsSection({
  content,
  meta,
  featured,
  categories,
}: AcademyPlatformMaterialsSectionProps) {
  const featuredMaterials = useMemo(
    () => featured.slice(0, Math.max(1, content.featuredCount)),
    [content.featuredCount, featured],
  );

  const allMaterials = useMemo(
    () => categories.flatMap((category) => category.materials),
    [categories],
  );

  if (meta.totalCount <= 0 || featuredMaterials.length === 0) {
    return null;
  }

  return (
    <section id="materiais-plataforma" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <PremiumSectionHeader
        label={content.label}
        title={`${content.title} ${content.titleHighlight}`}
        description={content.description}
        className="text-center [&_h2]:mx-auto [&_p]:mx-auto"
      />

      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featuredMaterials.map((material) => (
          <FeaturedMaterialCard
            key={material.id}
            material={material}
            exclusiveBadge={content.exclusiveBadge}
          />
        ))}
      </div>

      <div className="mb-8 flex flex-col items-center justify-between gap-4 rounded-[1.35rem] border border-[#003B7A]/10 bg-[#003B7A]/[0.03] px-5 py-5 sm:flex-row sm:px-6">
        <div className="flex items-start gap-3 text-center sm:text-left">
          <div className="mx-auto flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#009739]/10 sm:mx-0">
            <BookOpen className="size-5 text-[#009739]" />
          </div>
          <div>
            <p className="font-black text-[#003B7A]">Acervo completo na plataforma</p>
            <p className="mt-1 text-sm text-[#003B7A]/60">
              Assinantes CAB têm acesso integral a artigos, informativos e boletins técnicos.
            </p>
          </div>
        </div>
        <Button
          asChild
          className="h-11 shrink-0 rounded-xl bg-[#009739] px-6 font-bold text-white hover:bg-[#00b344]"
        >
          <a {...ASSOCIATE_AREA_LINK_PROPS}>
            {content.cta.label}
            <ArrowRight className="size-4" />
          </a>
        </Button>
      </div>

      <div className="mb-3 flex items-center gap-2">
        <Layers className="size-4 text-[#009739]" />
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#009739]">
          {content.catalog.title}
        </p>
      </div>

      <AcademyPlatformMaterialsCatalog
        materials={allMaterials}
        catalog={content.catalog}
        exclusiveBadge={content.exclusiveBadge}
      />
    </section>
  );
}
