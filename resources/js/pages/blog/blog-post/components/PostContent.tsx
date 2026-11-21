import { useMemo } from "react";
import DOMPurify from "dompurify";

interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  const sanitizedContent = useMemo(() => DOMPurify.sanitize(content), [content]);

  return (
    <article
      className="prose prose-lg max-w-none rounded-[1.35rem] border-2 border-[#003B7A]/10 bg-white p-6 shadow-[0_8px_30px_-14px_rgba(0,59,122,0.15)] prose-headings:font-black prose-headings:text-[#003B7A] prose-p:text-[#003B7A]/75 prose-a:text-[#009739] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#003B7A] prose-img:rounded-2xl prose-img:border prose-img:border-[#003B7A]/10 sm:p-8"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
