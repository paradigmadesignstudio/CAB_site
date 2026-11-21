import type { ReactNode } from "react";
import type { FAQSectionContent } from "@/types/common";
import { PremiumZebraBand } from "@/pages/components/premium/PremiumZebraBand";
import { PremiumSectionHeader } from "@/pages/components/premium/PremiumSectionHeader";

interface FAQSectionBlockProps {
  content: FAQSectionContent;
  children: ReactNode;
}

export function FAQSectionBlock({ content, children }: FAQSectionBlockProps) {
  return (
    <PremiumZebraBand tone="surface" className="py-14 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <PremiumSectionHeader
          label="Dúvidas"
          title={content.title}
          className="text-center [&_h2]:mx-auto [&_p]:mx-auto"
        />
        {children}
      </div>
    </PremiumZebraBand>
  );
}
