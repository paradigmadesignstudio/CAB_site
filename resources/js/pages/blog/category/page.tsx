import { DefaultHead } from "@/pages/components/layout/DefaultHead";
import Layout from "@/pages/layout";
import { BlogCategoryPageFrame } from "@/pages/blog/components/BlogCategoryPageFrame";
import { BlogCategoryDenseShell } from "@/pages/blog/components/BlogCategoryDenseShell";
import { BlogEventsCategoryDenseShell } from "@/pages/blog/components/BlogEventsCategoryDenseShell";
import type { BlogCategoryPageProps } from "@/pages/blog/types";

interface BlogCategoryRoutePageProps extends BlogCategoryPageProps {
  categoryShell: "default" | "events";
}

export default function BlogCategoryPage({
  categoryData,
  categoryRoute,
  categorySidecar,
  categoryShell,
}: BlogCategoryRoutePageProps) {
  return (
    <Layout>
      <DefaultHead
        title={`${categoryData.name} | Blog CAB — câmbio automático`}
        description={
          categoryData.description ||
          `Conteúdo técnico sobre ${categoryData.name.toLowerCase()} para oficinas e mecânicos de transmissão automática.`
        }
      />
      <BlogCategoryPageFrame>
        {categoryShell === "events" ? (
          <BlogEventsCategoryDenseShell
            categoryData={categoryData}
            categoryRoute={categoryRoute}
            categorySidecar={categorySidecar}
          />
        ) : (
          <BlogCategoryDenseShell
            categoryData={categoryData}
            categoryRoute={categoryRoute}
            categorySidecar={categorySidecar}
          />
        )}
      </BlogCategoryPageFrame>
    </Layout>
  );
}
