import { useEffect } from "react";
import { router } from "@inertiajs/react";
import { protectCabFromTranslation } from "@/lib/protectCabFromTranslation";

export function useCabTranslationProtection(): void {
  useEffect(() => {
    let frame = 0;

    const run = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        protectCabFromTranslation(document.body);
      });
    };

    run();

    const observer = new MutationObserver(run);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    const removeFinishListener = router.on("finish", run);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      removeFinishListener();
    };
  }, []);
}
