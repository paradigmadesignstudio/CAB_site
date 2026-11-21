import { LocationSection } from "@/pages/components/LocationSection";
import type { Coordinates } from "@/types/common";

interface PartnerLocationProps {
  address: string;
  city: string;
  state: string;
  coordinates?: Coordinates | null;
}

export function PartnerLocation({ address, city, state, coordinates }: PartnerLocationProps) {
  return (
    <LocationSection
      address={address}
      city={city}
      state={state}
      coordinates={coordinates}
      animate
    />
  );
}
