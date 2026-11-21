import type { Workshop } from "@/pages/member-workshops/types";

export function filterWorkshops(
  workshops: Workshop[],
  selectedState: string,
  searchTerm: string,
) {
  return workshops.filter((workshop) => {
    if (selectedState && workshop.state !== selectedState) return false;
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();
    return (
      workshop.name.toLowerCase().includes(term) ||
      workshop.city.toLowerCase().includes(term)
    );
  });
}

export function hasWorkshopContact(
  workshop: Pick<Workshop, "phone" | "whatsapp">,
): boolean {
  return Boolean(workshop.phone?.trim() || workshop.whatsapp?.trim());
}

export function hasWorkshopDescription(description?: string): boolean {
  return Boolean(description?.trim());
}

export function hasWorkshopSpecialties(specialties?: string[]): boolean {
  return Boolean(specialties && specialties.length > 0);
}

export function hasWorkshopLocation(
  workshop: Pick<Workshop, "address" | "city" | "state">,
): boolean {
  return Boolean(
    workshop.address?.trim()
      || (workshop.city?.trim() && workshop.state?.trim()),
  );
}
