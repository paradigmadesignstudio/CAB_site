import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * True on mobile and when the user prefers reduced motion.
 * Use to skip framer-motion on low-end devices and a11y settings.
 */
export function useLightMotion(): boolean {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return isMobile || reduceMotion;
}
