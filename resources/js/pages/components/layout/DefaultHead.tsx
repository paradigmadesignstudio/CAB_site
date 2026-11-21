import { Head, usePage } from "@inertiajs/react";
import { shieldCabInString } from "@/lib/cabBrand";
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE_PATH,
  isUsableSeoImage,
} from "@/lib/seo";
import type { SeoSharedProps } from "@/types/seo";

interface DefaultHeadProps {
  title?: string;
  description?: string;
  /** URL absoluta ou caminho público (/images/...). */
  image?: string;
  /** Open Graph type — use "article" em posts. */
  type?: "website" | "article";
  /** Objeto ou lista de objetos JSON-LD (schema.org). */
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const DEFAULT_TITLE = "CAB | Câmbio Automático do Brasil";
const DEFAULT_DESCRIPTION =
  "CAB é o aditivo de alta performance para o seu negócio. Estruturada com suporte técnico real, zero burocracia e parcerias transparentes.";

function buildCanonicalUrl(appUrl: string | undefined, path: string): string | undefined {
  if (!appUrl) {
    return undefined;
  }

  const normalizedPath = path.split("?")[0] || "/";

  return `${appUrl}${normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`}`;
}

export function DefaultHead({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  image,
  type = "website",
  jsonLd,
}: DefaultHeadProps) {
  const { url } = usePage();
  const { appUrl, defaultOgImage } = usePage<SeoSharedProps>().props;
  const canonical = buildCanonicalUrl(appUrl, url);
  const safeTitle = shieldCabInString(title);
  const safeDescription = shieldCabInString(description);

  const resolvedImagePath = isUsableSeoImage(image)
    ? image
    : isUsableSeoImage(defaultOgImage)
      ? defaultOgImage
      : DEFAULT_OG_IMAGE_PATH;

  const ogImage = absoluteUrl(appUrl, resolvedImagePath);
  const schemas = jsonLd == null ? [] : Array.isArray(jsonLd) ? jsonLd : [jsonLd];

  return (
    <Head>
      <title>{safeTitle}</title>
      <meta head-key="description" name="description" content={safeDescription} />
      <meta
        head-key="keywords"
        name="keywords"
        content={shieldCabInString(
          "câmbio automático, transmissão automática, apoio técnico ao reparador, material técnico para reparadores, rede de networking, eventos de transmissão, Academia CAB, rede de oficinas, parceiros CAB",
        )}
      />
      <meta head-key="theme-color" name="theme-color" content="#0E55B0" />
      <meta head-key="og:title" property="og:title" content={safeTitle} />
      <meta head-key="og:description" property="og:description" content={safeDescription} />
      <meta head-key="og:type" property="og:type" content={type} />
      <meta head-key="og:locale" property="og:locale" content="pt_BR" />
      <meta head-key="og:site_name" property="og:site_name" content="CAB — Câmbio Automático do Brasil" />
      {canonical && <meta head-key="og:url" property="og:url" content={canonical} />}
      {ogImage && <meta head-key="og:image" property="og:image" content={ogImage} />}
      {ogImage && <meta head-key="og:image:alt" property="og:image:alt" content={safeTitle} />}
      <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
      <meta head-key="twitter:title" name="twitter:title" content={safeTitle} />
      <meta head-key="twitter:description" name="twitter:description" content={safeDescription} />
      {ogImage && <meta head-key="twitter:image" name="twitter:image" content={ogImage} />}
      {canonical && <link head-key="canonical" rel="canonical" href={canonical} />}
      {schemas.map((schema, index) => (
        <script
          key={`jsonld-${index}`}
          type="application/ld+json"
          // Inertia Head serializa children de script como texto.
        >
          {JSON.stringify(schema)}
        </script>
      ))}
    </Head>
  );
}
