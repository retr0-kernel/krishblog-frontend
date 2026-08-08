import type {
  ApiResponse, Post, Section,
  LoginRequest, LoginResponse, User,
  OverviewStats, PostFormData, Comment,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

// ── Core fetch ────────────────────────────────────────────────────────────────

async function apiFetch<T>(
    path: string,
    init?: RequestInit & { token?: string }
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string>),
  };
  if (init?.token) headers["Authorization"] = `Bearer ${init.token}`;

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message ?? `API error ${res.status}`);
  return json as ApiResponse<T>;
}

// ── Public ────────────────────────────────────────────────────────────────────

export async function getPosts(params?: {
  page?: number;
  section?: string;
  q?: string;
  featured?: boolean;
  per_page?: number;
}): Promise<{ posts: Post[]; meta: { page: number; per_page: number; total: number; total_pages: number } }> {
  const sp = new URLSearchParams();
  if (params?.page) sp.set("page", String(params.page));
  if (params?.section) sp.set("section", params.section);
  if (params?.q) sp.set("q", params.q);
  if (params?.featured) sp.set("featured", "true");
  if (params?.per_page) sp.set("per_page", String(params.per_page));
  try {
    const r = await apiFetch<Post[]>(`/v1/public/posts?${sp}`);
    return {
      posts: r.data ?? [],
      meta: r.meta ?? { page: 1, per_page: 12, total: 0, total_pages: 0 },
    };
  } catch {
    return { posts: [], meta: { page: 1, per_page: 12, total: 0, total_pages: 0 } };
  }
}

export async function getPost(slug: string): Promise<Post> {
  const r = await apiFetch<Post>(`/v1/public/posts/${slug}`);
  return r.data;
}

export async function getSections(): Promise<Section[]> {
  try {
    const r = await apiFetch<Section[]>("/v1/public/sections");
    return r.data ?? [];
  } catch {
    return [];
  }
}

export async function getSection(slug: string): Promise<Section> {
  const r = await apiFetch<Section>(`/v1/public/sections/${slug}`);
  return r.data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function login(body: LoginRequest): Promise<LoginResponse> {
  const r = await apiFetch<LoginResponse>("/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return r.data;
}

export async function logout(token: string): Promise<void> {
  await apiFetch("/v1/auth/logout", { method: "POST", token });
}

export async function getMe(token: string): Promise<User> {
  const r = await apiFetch<User>("/v1/auth/me", { token });
  return r.data;
}

export async function refreshToken(): Promise<LoginResponse> {
  const r = await apiFetch<LoginResponse>("/v1/auth/refresh", { method: "POST" });
  return r.data;
}

// ── Admin posts ───────────────────────────────────────────────────────────────

export async function adminGetPosts(
    token: string,
    params?: { page?: number; q?: string; status?: string; per_page?: number }
): Promise<{ posts: Post[]; meta: { page: number; per_page: number; total: number; total_pages: number } }> {
  const sp = new URLSearchParams();
  if (params?.page) sp.set("page", String(params.page));
  if (params?.q) sp.set("q", params.q);
  if (params?.status) sp.set("status", params.status);
  if (params?.per_page) sp.set("per_page", String(params.per_page));
  try {
    const r = await apiFetch<Post[]>(`/v1/admin/posts?${sp}`, { token });
    return {
      posts: r.data ?? [],
      meta: r.meta ?? { page: 1, per_page: 10, total: 0, total_pages: 0 },
    };
  } catch {
    return { posts: [], meta: { page: 1, per_page: 10, total: 0, total_pages: 0 } };
  }
}

export async function adminGetPost(token: string, id: string): Promise<Post> {
  const r = await apiFetch<Post>(`/v1/admin/posts/${id}`, { token });
  return r.data;
}

export async function adminGetPostBySlug(token: string, slug: string): Promise<Post> {
  const r = await apiFetch<Post>(`/v1/admin/posts/slug/${slug}`, { token });
  return r.data;
}

export async function adminCreatePost(token: string, body: Partial<PostFormData>): Promise<Post> {
  const r = await apiFetch<Post>("/v1/admin/posts", {
    method: "POST",
    body: JSON.stringify(body),
    token,
  });
  return r.data;
}

export async function adminUpdatePost(token: string, id: string, body: Partial<PostFormData>): Promise<Post> {
  const r = await apiFetch<Post>(`/v1/admin/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
    token,
  });
  return r.data;
}

export async function adminUpdatePostStatus(token: string, id: string, status: string): Promise<Post> {
  const r = await apiFetch<Post>(`/v1/admin/posts/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
    token,
  });
  return r.data;
}

export async function adminDeletePost(token: string, id: string): Promise<void> {
  await apiFetch(`/v1/admin/posts/${id}`, { method: "DELETE", token });
}

// ── Admin sections ────────────────────────────────────────────────────────────

export async function adminGetSections(token: string): Promise<Section[]> {
  try {
    const r = await apiFetch<Section[]>("/v1/admin/sections", { token });
    return r.data ?? [];
  } catch {
    return [];
  }
}

export async function adminCreateSection(token: string, body: Partial<Section>): Promise<Section> {
  const r = await apiFetch<Section>("/v1/admin/sections", {
    method: "POST",
    body: JSON.stringify(body),
    token,
  });
  return r.data;
}

export async function adminUpdateSection(token: string, id: string, body: Partial<Section>): Promise<Section> {
  const r = await apiFetch<Section>(`/v1/admin/sections/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
    token,
  });
  return r.data;
}

export async function adminDeleteSection(token: string, id: string): Promise<void> {
  await apiFetch(`/v1/admin/sections/${id}`, { method: "DELETE", token });
}

// ── Admin analytics ───────────────────────────────────────────────────────────

export async function adminGetOverview(token: string, days = 30): Promise<OverviewStats> {
  try {
    const r = await apiFetch<OverviewStats>(`/v1/admin/analytics/overview?days=${days}`, { token });
    return r.data ?? {
      total_page_views: 0,
      unique_visitors: 0,
      avg_scroll_pct: 0,
      avg_read_time_sec: 0,
      top_posts: [],
      top_referrers: [],
      device_breakdown: [],
      country_breakdown: [],
      daily_views: [],
      period: `last_${days}_days`,
    };
  } catch {
    return {
      total_page_views: 0,
      unique_visitors: 0,
      avg_scroll_pct: 0,
      avg_read_time_sec: 0,
      top_posts: [],
      top_referrers: [],
      device_breakdown: [],
      country_breakdown: [],
      daily_views: [],
      period: `last_${days}_days`,
    };
  }
}

export async function adminGetPostStats(token: string, postId: string, days = 30) {
  const r = await apiFetch(`/v1/admin/analytics/posts/${postId}?days=${days}`, { token });
  return r.data;
}

// ── Analytics tracking ────────────────────────────────────────────────────────

export async function trackEvent(payload: {
  type: string;
  session_id: string;
  post_id?: string;
  path: string;
  referrer?: string;
  scroll_pct?: number;
  duration_ms?: number;
}) {
  try {
    await fetch(`${API_URL}/v1/analytics/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch { /* best-effort */ }
}

// ── Subscribers ───────────────────────────────────────────────────────────────

export async function adminGetSubscriberStats(token: string): Promise<{ total: number; confirmed: number }> {
  try {
    const r = await apiFetch<{ total: number; confirmed: number }>("/v1/admin/subscribers/stats", { token });
    return r.data ?? { total: 0, confirmed: 0 };
  } catch {
    return { total: 0, confirmed: 0 };
  }
}

export async function adminNotifySubscribers(
    token: string,
    body: { post_title: string; post_slug: string; post_summary: string },
): Promise<string> {
  const r = await apiFetch<{ message: string }>("/v1/admin/subscribers/notify", {
    method: "POST",
    body: JSON.stringify(body),
    token,
  });
  return r.data?.message ?? "Notifications sent.";
}

// ── Comments ──────────────────────────────────────────────────────────────────

export async function getComments(postId: string): Promise<Comment[]> {
  try {
    const r = await apiFetch<Comment[]>(`/v1/public/posts/${postId}/comments`);
    return r.data ?? [];
  } catch {
    return [];
  }
}

export async function postComment(postId: string, body: { author_name: string; author_email: string; content: string }): Promise<void> {
  await apiFetch(`/v1/public/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function adminGetComments(token: string, approved?: boolean): Promise<Comment[]> {
  const sp = new URLSearchParams();
  if (approved !== undefined) sp.set("approved", String(approved));
  try {
    const r = await apiFetch<Comment[]>(`/v1/admin/comments?${sp}`, { token });
    return r.data ?? [];
  } catch {
    return [];
  }
}

export async function adminApproveComment(token: string, id: string, isApproved: boolean): Promise<Comment> {
  const r = await apiFetch<Comment>(`/v1/admin/comments/${id}/approve`, {
    method: "PATCH",
    body: JSON.stringify({ is_approved: isApproved }),
    token,
  });
  return r.data;
}

export async function adminReplyComment(token: string, id: string, content: string): Promise<Comment> {
  const r = await apiFetch<Comment>(`/v1/admin/comments/${id}/reply`, {
    method: "POST",
    body: JSON.stringify({ content }),
    token,
  });
  return r.data;
}

export async function adminDeleteComment(token: string, id: string): Promise<void> {
  await apiFetch(`/v1/admin/comments/${id}`, { method: "DELETE", token });
}

