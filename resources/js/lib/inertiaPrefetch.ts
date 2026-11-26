import { router } from "@inertiajs/react";

/** Prefetch Inertia ao passar o mouse (padrão recomendado para navegação principal). */
export const INERTIA_PREFETCH_HOVER = "hover" as const;

export function isPrefetchableHref(href: string): boolean {
  return (
    !href.startsWith("http://") &&
    !href.startsWith("https://") &&
    !href.startsWith("mailto:") &&
    !href.startsWith("tel:") &&
    !href.startsWith("#")
  );
}

const HEAVY_PREFIXES = ["/oficinas", "/blog", "/planos", "/academia-cab"];

function isHeavyPath(path: string): boolean {
  return HEAVY_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}

export function inertiaPrefetchPath(href: string): void {
  if (!isPrefetchableHref(href)) {
    return;
  }

  const path = href.includes("#") ? href.split("#")[0] : href;

  if (!path || path === window.location.pathname || isHeavyPath(path)) {
    return;
  }

  router.prefetch(path);
}
