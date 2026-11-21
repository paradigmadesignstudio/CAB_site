import type { PageMeta } from "@/types/common";
import type { AgendaEvent } from "@/types/agenda";

export interface BlogAuthor {
  name: string;
  avatar: string;
  bio: string;
  initials: string;
}

export interface BlogRelatedPost {
  slug: string;
  title: string;
  image: string;
  imageMobile?: string | null;
  date: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  imageMobile?: string | null;
  category: string;
  author: BlogAuthor;
  date: string;
  readTime: string;
  tags: string[];
  relatedPosts: BlogRelatedPost[];
}

export interface BlogCategoryNavItem {
  name: string;
  link: string;
}

export interface BlogFeaturedCard {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorInitials: string;
  date: string;
  readTime: string;
  image: string;
  imageMobile?: string | null;
  link: string;
}

export interface BlogSubFeaturedCard {
  id: number;
  title: string;
  category: string;
  date: string;
  author: string;
  authorInitials: string;
  link: string;
  image?: string;
  imageMobile?: string | null;
}

export interface BlogRecentCard {
  id: number;
  title: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  authorInitials: string;
  link: string;
  image?: string;
  imageMobile?: string | null;
}

export interface BlogColumnist {
  name: string;
  role: string;
  initials: string;
}

export interface BlogPagination {
  page: number;
  perPage: number;
  total: number;
  hasMore: boolean;
  categorySlug?: string;
}

export interface BlogIndexPageContent {
  meta: PageMeta;
  defaultCategory: string;
  categories: BlogCategoryNavItem[];
  featuredPost: BlogFeaturedCard | null;
  subFeaturedPosts: BlogSubFeaturedCard[];
  recentPosts: BlogRecentCard[];
  recentPagination?: BlogPagination;
  columnists: BlogColumnist[];
  /** Próximos eventos para destaque no índice do blog. */
  upcomingEvents?: AgendaEvent[];
}

export interface BlogPostPageProps {
  slug: string;
}

export interface BlogPostPageComponentProps extends BlogPostPageProps {
  post: BlogPost | null;
}

export interface BlogSearchItem {
  id: number;
  title: string;
  excerpt?: string;
  category: string;
  date: string;
  readTime?: string;
  author: string;
  authorInitials: string;
  link: string;
  image?: string;
  imageMobile?: string | null;
}

export interface BlogIndexShellData {
  trendingPosts: BlogRecentCard[];
  feedPreviewPosts: BlogRecentCard[];
  categoryHighlights: BlogCategoryHighlight[];
}

export interface BlogCategorySidecarData {
  trendingPosts?: BlogRecentCard[];
  feedPreviewPosts?: BlogRecentCard[];
  categoryHighlights?: BlogCategoryHighlight[];
  upcomingEvents?: AgendaEvent[];
}

export interface BlogIndexPageProps {
  pageContent: BlogIndexPageContent;
  indexShell?: BlogIndexShellData;
}

export interface BlogCategoryGridPost {
  id: number;
  title: string;
  excerpt?: string;
  date: string;
  readTime: string;
  author: string;
  authorInitials: string;
  link: string;
  image?: string;
  imageMobile?: string | null;
}

export interface BlogCategoryPageData {
  name: string;
  description: string;
  allCategoriesList: BlogCategoryNavItem[];
  featuredPost: (Omit<BlogFeaturedCard, "id"> & { id?: number }) | null;
  /** Próximos eventos (categoria Eventos via API). */
  upcomingEvents?: AgendaEvent[];
  /** Eventos encerrados (categoria Eventos via API). */
  pastEvents?: AgendaEvent[];
  posts: BlogCategoryGridPost[];
  postsPagination?: BlogPagination;
}

export interface BlogCategoryHighlight {
  category: BlogCategoryNavItem;
  post: BlogRecentCard;
}

export interface BlogCategoryPageProps {
  categoryData: BlogCategoryPageData;
  categoryRoute: string;
  categorySidecar?: BlogCategorySidecarData;
}

export interface ColumnistArticle {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  imageMobile?: string | null;
  date: string;
  slug: string;
  category: string;
}

export interface Columnist {
  id: number;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  slug: string;
  articles: ColumnistArticle[];
}

export interface ColumnistsPageProps {
  columnists: Columnist[];
}
