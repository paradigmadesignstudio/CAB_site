import { BlogEcosystemBand } from "@/pages/blog/components/BlogEcosystemBand";
import { BlogContextualNewsletter } from "@/pages/blog/components/BlogContextualNewsletter";
import { resolveEditorialContext } from "@/pages/blog/lib/blogEditorialContext";
import { AuthorCard } from "@/pages/blog/blog-post/components/AuthorCard";
import { HeroPost } from "@/pages/blog/blog-post/components/HeroPost";
import { PlanCTA } from "@/pages/blog/blog-post/components/PlanCTA";
import { PostArticleFooter } from "@/pages/blog/blog-post/components/PostArticleFooter";
import { PostBreadcrumb } from "@/pages/blog/blog-post/components/PostBreadcrumb";
import { PostContent } from "@/pages/blog/blog-post/components/PostContent";
import { PostRelatedDense } from "@/pages/blog/blog-post/components/PostRelatedDense";
import { PostSidebar } from "@/pages/blog/blog-post/components/PostSidebar";
import type { BlogPost } from "@/pages/blog/types";

interface BlogPostDenseShellProps {
  post: BlogPost;
}

export function BlogPostDenseShell({ post }: BlogPostDenseShellProps) {
  const editorialContext = resolveEditorialContext(post.category);

  return (
    <div className="bg-[#FAFBFC] pb-12">
      <PostBreadcrumb post={post} />

      <section className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 sm:pt-10">
        <HeroPost post={post} showExcerpt />
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          <div className="space-y-8 lg:col-span-8">
            <PostContent content={post.content} />

            <PostArticleFooter post={post} />

            <PlanCTA />
          </div>

          <div className="lg:col-span-4">
            <PostSidebar post={post} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <AuthorCard author={post.author} />
      </section>

      <PostRelatedDense posts={post.relatedPosts} categoryName={post.category} />

      <BlogContextualNewsletter context={editorialContext} categoryName={post.category} />

      <BlogEcosystemBand context={editorialContext} />
    </div>
  );
}
