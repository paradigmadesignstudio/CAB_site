import { createContext, useCallback, useContext, useLayoutEffect, useState, type ReactNode } from "react";
import { useDeferredMount } from "@/hooks/useDeferredMount";

const HomeSectionReadyContext = createContext<(() => void) | null>(null);

interface DeferredHomeSectionProps {
  children: ReactNode;
  minHeight?: string;
}

export function DeferredHomeSection({
  children,
  minHeight = "1px",
}: DeferredHomeSectionProps) {
  const { ref, mounted } = useDeferredMount();
  const [ready, setReady] = useState(false);
  const markReady = useCallback(() => setReady(true), []);

  return (
    <HomeSectionReadyContext.Provider value={markReady}>
      <div ref={ref} style={{ minHeight: ready ? undefined : minHeight }}>
        {mounted ? children : null}
      </div>
    </HomeSectionReadyContext.Provider>
  );
}

export function HomeSectionReveal({ children }: { children: ReactNode }) {
  const markReady = useContext(HomeSectionReadyContext);

  useLayoutEffect(() => {
    markReady?.();
  }, [markReady]);

  return <div className="home-section-in">{children}</div>;
}
