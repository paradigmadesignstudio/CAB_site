/**
 * Estilos e tema padrão dos mapas CAB (mapcn / MapLibre).
 * @see https://www.mapcn.dev/docs/basic-map#custom-styles
 */
export const CAB_MAP_STYLES = {
  /** OpenFreeMap — estilo claro customizado (OpenStreetMap). */
  light: "https://tiles.openfreemap.org/styles/bright",
  /** Fallback escuro (Carto), caso o tema mude no futuro. */
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
} as const;

export const CAB_MAP_THEME = "light" as const;

/** Props compartilhadas para todos os `<Map />` do site. */
export const cabMapProps = {
  theme: CAB_MAP_THEME,
  styles: CAB_MAP_STYLES,
} as const;
