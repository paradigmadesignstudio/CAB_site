export type AgendaEventStatus = "happening" | "upcoming" | "ended";

export interface AgendaEvent {
  id: number;
  slug?: string;
  title: string;
  excerpt: string;
  date: string;
  time: string;
  location: string;
  status: AgendaEventStatus;
  image: string;
  imageMobile?: string | null;
  link: string;
  modalidade?: string;
  uf?: string;
  priceLabel?: string;
}

export const AGENDA_STATUS_LABEL: Record<AgendaEventStatus, string> = {
  happening: "Acontecendo agora",
  upcoming: "Em breve",
  ended: "Encerrado",
};

export interface AgendaEventScheduleItem {
  time: string;
  title: string;
  speaker?: string;
}

export interface AgendaEventScheduleDay {
  label: string;
  items: AgendaEventScheduleItem[];
}

export interface AgendaEventVenue {
  name: string;
  address: string;
  city: string;
  state: string;
  coordinates?: { lat: number; lng: number } | null;
}

export interface AgendaGalleryImage {
  full: string;
  thumb: string;
}

export interface AgendaEventDetail extends AgendaEvent {
  slug: string;
  description: string[];
  venue: AgendaEventVenue;
  schedule: AgendaEventScheduleDay[];
  ticketUrl?: string;
  priceLabel?: string;
  organizer: string;
  tags: string[];
  highlights: string[];
  galleryImageCount?: number;
  galleryImages?: AgendaGalleryImage[];
  formasPagamento?: string[];
  parcelamento?: number | null;
  capacidadeTotal?: number | null;
  inscricoesAbertasEm?: string;
  inscricoesEncerramEm?: string;
}
