import { DefaultHead } from "@/pages/components/layout/DefaultHead";
import Layout from "@/pages/layout";
import { BlogCategoryPageFrame } from "@/pages/blog/components/BlogCategoryPageFrame";
import { BlogIndexDenseShell } from "@/pages/blog/components/BlogIndexDenseShell";
import type { BlogIndexPageProps } from "./types";

export default function BlogIndexPage({ pageContent, indexShell }: BlogIndexPageProps) {
  return (
    <Layout>
      <DefaultHead title={pageContent.meta.title} description={pageContent.meta.description} />
      <BlogCategoryPageFrame>
        <BlogIndexDenseShell pageContent={pageContent} indexShell={indexShell} />
      </BlogCategoryPageFrame>
    </Layout>
  );
}
