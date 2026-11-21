import { NAV_LINKS } from "@/pages/components/layout/data/navigation";

export interface BlogCategoryLink {
  label: string;
  href: string;
}

export function getBlogCategoryLink(categoryName: string): string {
  if (categoryName === "Geral") {
    return "/blog";
  }

  const blogNav = NAV_LINKS.find((item) => item.label === "Blog");
  const match = blogNav?.subLinks?.find((subLink) => subLink.label === categoryName);

  return match?.href ?? "/blog";
}

export function getBlogCategoryLinks(excludeLabel?: string): BlogCategoryLink[] {
  const blogNav = NAV_LINKS.find((item) => item.label === "Blog");
  const links: BlogCategoryLink[] = [{ label: "Blog", href: "/blog" }];

  for (const subLink of blogNav?.subLinks ?? []) {
    if (subLink.label === excludeLabel) {
      continue;
    }
    links.push(subLink);
  }

  return links;
}
