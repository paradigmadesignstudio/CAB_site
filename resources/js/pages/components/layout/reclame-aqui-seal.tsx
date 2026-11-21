import { useEffect, useRef } from "react";

/**
 * Embed oficial do selo verificado Reclame Aqui (fundo verde).
 * Código fornecido pelo RA — não alterar atributos, URL ou IDs.
 *
 * <div id="ra-verified-seal"><script type="text/javascript" id="ra-embed-verified-seal" src="https://s3.amazonaws.com/raichu-beta/ra-verified/bundle.js" data-id="UkpRV3VTQWgwSmRmd3YtTDpjYW1iaW8tYXV0b21hdGljby1kby1icmFzaWw=" data-target="ra-verified-seal" data-model="horizontal_3"></script></div>
 */
export function ReclameAquiSeal() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || document.getElementById("ra-embed-verified-seal")) {
      return;
    }

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "ra-embed-verified-seal";
    script.src = "https://s3.amazonaws.com/raichu-beta/ra-verified/bundle.js";
    script.setAttribute(
      "data-id",
      "UkpRV3VTQWgwSmRmd3YtTDpjYW1iaW8tYXV0b21hdGljby1kby1icmFzaWw=",
    );
    script.setAttribute("data-target", "ra-verified-seal");
    script.setAttribute("data-model", "horizontal_3");
    container.appendChild(script);
  }, []);

  return <div id="ra-verified-seal" ref={containerRef} />;
}
