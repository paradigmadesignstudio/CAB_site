import { usePage } from "@inertiajs/react";
import Layout from "@/pages/layout";
import { DefaultHead } from "@/pages/components/layout/DefaultHead";
import { NotFound } from "@/pages/components/NotFound";
import { BlogCategoryPageFrame } from "@/pages/blog/components/BlogCategoryPageFrame";
import { BlogPostDenseShell } from "./components/BlogPostDenseShell";
import {
  absoluteUrl,
  buildBlogPostingJsonLd,
  isUsableSeoImage,
} from "@/lib/seo";
import type { BlogPostPageComponentProps } from "@/pages/blog/types";
import type { SeoSharedProps } from "@/types/seo";

export default function BlogPostPage({ post }: BlogPostPageComponentProps) {
  const { url } = usePage();
  const { appUrl, siteCompany } = usePage<SeoSharedProps>().props;

  if (!post) {
    return (
      <NotFound
        title="Post não encontrado"
        backHref="/blog"
        backLabel="Voltar para o blog"
      />
    );
  }

  const canonical = appUrl
    ? absoluteUrl(appUrl, url.split("?")[0] || `/blog/${post.slug}`)
    : undefined;
  const imagePath = isUsableSeoImage(post.image) ? post.image : undefined;
  const image = imagePath && appUrl ? absoluteUrl(appUrl, imagePath) : undefined;
  const publisherLogo = appUrl ? absoluteUrl(appUrl, "/images/geral/cab.png") : undefined;

  const jsonLd =
    canonical
      ? buildBlogPostingJsonLd({
          title: post.title,
          description: post.excerpt,
          url: canonical,
          image,
          datePublished: post.date,
          authorName: post.author?.name,
          publisherName: siteCompany?.trade_name || "CAB — Câmbio Automático do Brasil",
          publisherLogo,
        })
      : undefined;

  return (
    <Layout>
      <DefaultHead
        title={`${post.title} | Blog CAB`}
        description={post.excerpt}
        image={imagePath}
        type="article"
        jsonLd={jsonLd}
      />

      <BlogCategoryPageFrame>
        <BlogPostDenseShell post={post} />
      </BlogCategoryPageFrame>
    </Layout>
  );
}
