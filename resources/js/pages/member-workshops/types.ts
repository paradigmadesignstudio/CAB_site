import type {
  CTAContent,
  Coordinates,
  FAQSectionContent,
  HeroContent,
  ListSectionContent,
  PageMeta,
  StatItem,
} from "@/types/common";
import type { AgendaGalleryImage } from "@/types/agenda";

export interface Workshop {
  id: number;
  slug: string;
  name: string;
  description: string;
  fullDescription: string;
  category: string;
  logo: string;
  website: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  whatsapp: string;
  specialties: string[];
  coordinates?: Coordinates;
  /** Imagem de capa para popup do mapa (API). Fallback: `logo`. */
  coverImage?: string;
  /** Variante compacta da capa para mobile, quando a API fornecer. */
  coverImageMobile?: string | null;
  /** Quantidade de fotos da galeria (sem URLs no payload inicial). */
  galleryImageCount?: number;
  /** Galeria completa — chega via Inertia::defer. */
  galleryImages?: AgendaGalleryImage[];
  /** Metadados opcionais para enriquecer o popup quando a API disponibilizar. */
  rating?: number;
  reviewCount?: number;
  hours?: string;
}

export interface WorkshopListPageContent {
  meta: PageMeta;
  hero: HeroContent;
  stats: StatItem[];
  listSection: ListSectionContent;
  faq: FAQSectionContent;
  becomeAssociate: CTAContent;
  disclaimer: string;
  backLink: {
    href: string;
    label: string;
  };
}

export interface WorkshopDetailPageProps {
  slug: string;
}

export interface WorkshopListPageProps {
  pageContent: WorkshopListPageContent;
  brazilStates: string[];
  workshops?: Workshop[];
}
