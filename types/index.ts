export interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  cover_image?: string;
  cover_image_alt?: string;
  status: "draft" | "scheduled" | "published" | "archived";
  published: boolean;
  read_time: number;
  word_count: number;
  is_featured: boolean;
  meta_title?: string;
  meta_desc?: string;
  og_image?: string;
  published_at?: string;
  section_slug?: string;
  section_id: string;
  author_id: string;
  blocks?: PostBlock[];
}

export interface PostBlock {
  id: string;
  type: "heading" | "paragraph" | "image" | "code" | "quote" | "divider" | "embed" | "callout" | "list" | "table";
  content: string;
  attrs?: Record<string, unknown>;
  position: number;
}

export interface Section {
  id: string;
  name: string;
  slug: string;
  description?: string;
  theme_color?: string;
  cover_image?: string;
  layout: "feed" | "grid" | "featured" | "minimal" | "magazine";
  is_active: boolean;
  sort_order: number;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: { code: string; message: string };
  meta?: PaginationMeta;
}

export interface PostsResponse {
  posts: Post[];
  meta: PaginationMeta;
}
