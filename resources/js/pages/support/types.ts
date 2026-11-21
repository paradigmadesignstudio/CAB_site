import type { FAQSectionContent, PageMeta } from "@/types/common";

export interface ContactInfoItem {
  icon: string;
  title: string;
  content: string;
  link: string;
  color: string;
}

export interface SupportPageContent {
  meta: PageMeta;
  faq: FAQSectionContent;
}

export interface SupportPageProps {
  pageContent: SupportPageContent;
  contactInfo: ContactInfoItem[];
}
