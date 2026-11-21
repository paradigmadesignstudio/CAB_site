import type { Partner } from "./types";

function stripHtml(html: string): string {
  if (typeof document !== "undefined") {
    const element = document.createElement("div");
    element.innerHTML = html;
    return (element.textContent || element.innerText || "").replace(/\s+/g, " ").trim();
  }

  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function getPartnerStory(partner: Partner): string {
  return partner.story?.trim() || partner.fullDescription?.trim() || partner.description?.trim() || "";
}

export function getPartnerShortDescription(partner: Partner): string {
  return partner.shortDescription?.trim() || partner.description?.trim() || "";
}

export function getPartnerSummary(partner: Partner): string {
  return getPartnerShortDescription(partner);
}

export function isFeaturedSponsor(partner: Partner): boolean {
  return partner.role === "sponsor";
}

export function filterPartners(
  partners: Partner[],
  query: string,
  category: string | null,
) {
  let filtered = [...partners];

  if (query) {
    const normalizedQuery = query.toLowerCase();
    filtered = filtered.filter((partner) => {
      const story = getPartnerStory(partner);

      return (
        partner.name.toLowerCase().includes(normalizedQuery) ||
        getPartnerShortDescription(partner).toLowerCase().includes(normalizedQuery) ||
        partner.description.toLowerCase().includes(normalizedQuery) ||
        stripHtml(story).toLowerCase().includes(normalizedQuery)
      );
    });
  }

  if (category && category !== "all") {
    filtered = filtered.filter((partner) => partner.category === category);
  }

  return filtered;
}
