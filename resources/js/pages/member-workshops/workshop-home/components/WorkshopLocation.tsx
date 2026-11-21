import { LocationSection } from "@/pages/components/LocationSection";
import { hasWorkshopLocation } from "@/pages/member-workshops/services";
import type { Coordinates } from "@/types/common";

interface WorkshopLocationProps {
  address: string;
  city: string;
  state: string;
  coordinates?: Coordinates | null;
}

export function WorkshopLocation({
  address,
  city,
  state,
  coordinates,
}: WorkshopLocationProps) {
  if (!hasWorkshopLocation({ address, city, state })) {
    return null;
  }

  return (
    <LocationSection
      address={address}
      city={city}
      state={state}
      coordinates={coordinates}
      headerVariant="workshop"
    />
  );
}
