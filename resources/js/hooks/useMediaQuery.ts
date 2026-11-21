import { useEffect, useState } from "react";

function subscribeMediaQuery(
  media: MediaQueryList,
  onChange: () => void,
): () => void {
  onChange();

  if (typeof media.addEventListener === "function") {
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }

  media.addListener(onChange);
  return () => media.removeListener(onChange);
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    return subscribeMediaQuery(media, () => setMatches(media.matches));
  }, [query]);

  return matches;
}
