import { usePage } from "@inertiajs/react";

export interface SiteFeatures {
  oficinas: boolean;
  blogColumnists: boolean;
}

const DEFAULT_FEATURES: SiteFeatures = {
  oficinas: false,
  blogColumnists: false,
};

export function useSiteFeatures(): SiteFeatures {
  const page = usePage<{ features?: SiteFeatures }>();

  return page.props.features ?? DEFAULT_FEATURES;
}
