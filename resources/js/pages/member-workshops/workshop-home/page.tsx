import { Deferred, Link, usePage } from "@inertiajs/react";
import { DefaultHead } from "@/pages/components/layout/DefaultHead";
import { ChevronLeft } from "lucide-react";
import Layout from "@/pages/layout";
import { NotFound } from "@/pages/components/NotFound";
import { PremiumPageFrame, PremiumZebraBand } from "@/pages/components/premium";
import { cn } from "@/lib/utils";
import {
  hasWorkshopContact,
  hasWorkshopDescription,
  hasWorkshopLocation,
  hasWorkshopSpecialties,
} from "@/pages/member-workshops/services";
import {
  absoluteUrl,
  buildLocalBusinessJsonLd,
  isUsableSeoImage,
} from "@/lib/seo";
import { WorkshopHero } from "./components/WorkshopHero";
import { WorkshopDescription } from "./components/WorkshopDescription";
import { WorkshopSpecialties } from "./components/WorkshopSpecialties";
import {
  WorkshopPhotoGallerySection,
  WorkshopPhotoGallerySectionFallback,
} from "./components/WorkshopPhotoGallerySection";
import { WorkshopLocation } from "./components/WorkshopLocation";
import { ContactModal } from "./components/ContactModal";
import { PlansCTA } from "./components/PlansCTA";
import { BlogCTA } from "./components/BlogCTA";
import { AcademiaCABCTA } from "./components/AcademiaCABCTA";
import type { Workshop, WorkshopDetailPageProps } from "@/pages/member-workshops/types";
import type { AgendaGalleryImage } from "@/types/agenda";
import type { SeoSharedProps } from "@/types/seo";

interface WorkshopHomePageProps extends WorkshopDetailPageProps {
  workshop?: Workshop | null;
  galleryImages?: AgendaGalleryImage[];
  backLink: {
    href: string;
    label: string;
  };
}

export default function WorkshopHomePage({
  slug,
  workshop: workshopProp,
  galleryImages,
  backLink,
}: WorkshopHomePageProps) {
  const workshop = workshopProp ?? null;
  const { url } = usePage();
  const { appUrl, siteCompany } = usePage<SeoSharedProps>().props;

  if (!workshop) {
    return (
      <NotFound
        title="Oficina não encontrada"
        backHref={backLink.href}
        backLabel={backLink.label}
      />
    );
  }

  const showContact = hasWorkshopContact(workshop);
  const showDescription = hasWorkshopDescription(workshop.fullDescription);
  const showSpecialties = hasWorkshopSpecialties(workshop.specialties);
  const showProfileSection = showDescription || showSpecialties;
  const showLocation = hasWorkshopLocation(workshop);
  const hasGallery = (workshop.galleryImageCount ?? galleryImages?.length ?? 0) > 0;

  const imageCandidate = workshop.coverImage || workshop.logo;
  const imagePath = isUsableSeoImage(imageCandidate) ? imageCandidate : undefined;
  const canonical = appUrl
    ? absoluteUrl(appUrl, url.split("?")[0] || `/oficinas/${workshop.slug || slug}`)
    : undefined;
  const image = imagePath && appUrl ? absoluteUrl(appUrl, imagePath) : undefined;

  const jsonLd =
    canonical && appUrl
      ? buildLocalBusinessJsonLd({
          name: workshop.name,
          description: workshop.description || workshop.fullDescription || workshop.name,
          url: canonical,
          image,
          telephone: workshop.phone || workshop.whatsapp || undefined,
          address: workshop.address,
          city: workshop.city,
          state: workshop.state,
          parentOrganizationName: siteCompany?.trade_name || "CAB — Câmbio Automático do Brasil",
          parentOrganizationUrl: appUrl,
        })
      : undefined;

  return (
    <Layout>
      <DefaultHead
        title={`${workshop.name} | Oficinas`}
        description={workshop.description}
        image={imagePath}
        jsonLd={jsonLd}
      />

      <PremiumPageFrame>
        <PremiumZebraBand tone="canvas" className="py-10 sm:py-14 lg:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <Link
              href={backLink.href}
              className="group mb-8 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-[#003B7A]/60 transition-colors hover:text-[#009739]"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              {backLink.label}
            </Link>

            <div
              className={cn(
                "grid grid-cols-1 gap-8",
                showContact && "lg:grid-cols-3",
              )}
            >
              <div className={cn(showContact && "lg:col-span-2")}>
                <WorkshopHero workshop={workshop} />
              </div>
              {showContact && (
                <div className="lg:col-span-1">
                  <ContactModal workshop={workshop} />
                </div>
              )}
            </div>
          </div>
        </PremiumZebraBand>

        {showProfileSection && (
          <PremiumZebraBand tone="surface" className="py-10 sm:py-14">
            <div className="mx-auto max-w-5xl space-y-10 px-4 sm:px-6">
              {showDescription && (
                <WorkshopDescription description={workshop.fullDescription} />
              )}
              {showSpecialties && (
                <WorkshopSpecialties specialties={workshop.specialties} />
              )}
            </div>
          </PremiumZebraBand>
        )}

        {hasGallery && (
          <PremiumZebraBand tone={showProfileSection ? "canvas" : "surface"} className="py-10 sm:py-14">
            <div className="mx-auto max-w-5xl px-4 sm:px-6">
              <Deferred
                data="galleryImages"
                fallback={<WorkshopPhotoGallerySectionFallback />}
              >
                <WorkshopPhotoGallerySection
                  images={galleryImages ?? []}
                  title={workshop.name}
                />
              </Deferred>
            </div>
          </PremiumZebraBand>
        )}

        <PremiumZebraBand tone={hasGallery ? "surface" : "canvas"} className="py-10 sm:py-14">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            {showLocation && (
              <WorkshopLocation
                address={workshop.address}
                city={workshop.city}
                state={workshop.state}
                coordinates={workshop.coordinates}
              />
            )}
            <div className={cn(showLocation && "mt-10")}>
              <PlansCTA />
            </div>
          </div>
        </PremiumZebraBand>

        <PremiumZebraBand tone="glow" className="py-10 sm:py-14">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:gap-5 sm:px-6">
            <BlogCTA />
            <AcademiaCABCTA />
          </div>
        </PremiumZebraBand>
      </PremiumPageFrame>
    </Layout>
  );
}
