// ── Public types ──────────────────────────────────────────────────────────────

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string; // only populated on single post view
  cover_image?: string;
  cover_image_alt?: string;
  status: "draft" | "scheduled" | "published" | "archived";
  reading_time_min: number;
  word_count: number;
  is_featured: boolean;
  meta_title?: string;
  meta_desc?: string;
  published_at?: string;
  scheduled_at?: string;
  section_slug?: string;
  section_id: string;
  author_id: string;
  created_at: string;
  updated_at: string;
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

// ── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: "superadmin" | "admin" | "editor" | "viewer";
  is_active: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  access_token: string;
  expires_in: number;
}

// ── Admin post form ───────────────────────────────────────────────────────────

export interface PostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  section_id: string;
  status: "draft" | "published" | "archived" | "scheduled";
  is_featured: boolean;
  cover_image: string;
  cover_image_alt: string;
  meta_title: string;
  meta_desc: string;
  scheduled_at?: string | null;
}

// ── Analytics ─────────────────────────────────────────────────────────────────

export interface OverviewStats {
  period: string;
  total_page_views: number;
  unique_visitors: number;
  avg_scroll_pct: number | null;
  avg_read_time_sec: number | null;
  top_posts: PostStat[] | null;
  top_referrers: ReferrerStat[] | null;
  device_breakdown: DeviceStat[] | null;
  country_breakdown: CountryStat[] | null;
  daily_views: DailyStat[] | null;
}

export interface PostStat {
  post_id: string;
  post_title: string;
  post_slug: string;
  views: number;
  unique_visitors: number;
  avg_scroll_pct: number;
}

export interface ReferrerStat {
  referrer: string;
  count: number;
}

export interface DeviceStat {
  device: string;
  count: number;
  pct: number;
}

export interface CountryStat {
  country: string;
  count: number;
  pct: number;
}

export interface DailyStat {
  date: string;
  page_views: number;
  unique_visitors: number;
}

// ── Comments ──────────────────────────────────────────────────────────────────

export interface Comment {
  id: string;
  post_id: string;
  parent_id?: string;
  author_name: string;
  author_email?: string; // only in admin view
  content: string;
  is_approved: boolean;
  is_admin_reply: boolean;
  replies?: Comment[];
  created_at: string;
  updated_at: string;
}

// ── Claps ─────────────────────────────────────────────────────────────────────

export interface ClapStats {
  post_id: string;
  total_claps: number;
  user_claps: number;
}

