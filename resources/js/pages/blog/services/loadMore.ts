import axios from "axios";
import type { BlogCategoryGridPost, BlogPagination, BlogRecentCard } from "@/pages/blog/types";

interface LoadMoreResponse {
  posts: BlogRecentCard[] | BlogCategoryGridPost[];
  pagination: BlogPagination;
}

export async function fetchBlogPosts(params: {
  context: "index" | "category";
  page: number;
  category?: string;
}): Promise<LoadMoreResponse> {
  const { data } = await axios.get<LoadMoreResponse>("/blog/posts/load-more", { params });

  return data;
}
