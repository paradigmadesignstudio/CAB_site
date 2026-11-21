import { Link } from "@inertiajs/react";
import { Cookie, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { INERTIA_PREFETCH_HOVER } from "@/lib/inertiaPrefetch";
import {
  acknowledgeCookieNotice,
  hasAcknowledgedCookieNotice,
} from "@/lib/cookieNoticeStorage";

const VISIBLE_MS = 5_000;
const EXIT_MS = 280;

export function CookieNotice() {
  const [phase, setPhase] = useState<"hidden" | "visible" | "exiting">("hidden");
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isClosingRef = useRef(false);

  const dismiss = useCallback(() => {
    if (isClosingRef.current || phase === "hidden") {
      return;
    }

    isClosingRef.current = true;
    acknowledgeCookieNotice();
    setPhase("exiting");

    exitTimerRef.current = setTimeout(() => {
      setPhase("hidden");
    }, EXIT_MS);
  }, [phase]);

  useEffect(() => {
    if (hasAcknowledgedCookieNotice()) {
      return;
    }

    setPhase("visible");

    const dismissTimer = setTimeout(() => {
      if (isClosingRef.current) {
        return;
      }

      isClosingRef.current = true;
      acknowledgeCookieNotice();
      setPhase("exiting");

      exitTimerRef.current = setTimeout(() => {
        setPhase("hidden");
      }, EXIT_MS);
    }, VISIBLE_MS);

    return () => {
      clearTimeout(dismissTimer);

      if (exitTimerRef.current) {
        clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }
    };
  }, []);

  if (phase === "hidden") {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Aviso sobre cookies"
      className={`fixed bottom-20 left-4 right-4 z-40 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md ${
        phase === "exiting"
          ? "animate-out fade-out slide-out-to-bottom-2 duration-300"
          : "animate-in fade-in slide-in-from-bottom-2 duration-300"
      }`}
    >
      <div className="flex items-start gap-3 rounded-xl border border-[#003B7A]/12 bg-white/95 px-4 py-3 shadow-[0_12px_40px_-16px_rgba(0,59,122,0.35)] backdrop-blur-sm">
        <Cookie className="mt-0.5 h-4 w-4 shrink-0 text-[#009739]" aria-hidden />

        <p className="flex-1 text-sm leading-relaxed text-[#003B7A]/85">
          Utilizamos cookies essenciais para o funcionamento e a segurança do site.{" "}
          <Link
            href="/politica-de-cookies"
            prefetch={INERTIA_PREFETCH_HOVER}
            className="font-semibold text-[#009739] underline-offset-2 hover:underline"
          >
            Saiba mais
          </Link>
          .
        </p>

        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-md p-1 text-[#003B7A]/45 transition-colors hover:bg-[#003B7A]/5 hover:text-[#003B7A]"
          aria-label="Fechar aviso de cookies"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
