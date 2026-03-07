import type { ApiResponse, Post, PostsResponse, Section } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message ?? "API error");
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

  const r = await apiFetch<PostsResponse>(`/v1/public/posts?${sp}`);
  return r.data;
}

export async function getPost(slug: string): Promise<Post> {
  const r = await apiFetch<Post>(`/v1/public/posts/${slug}`);
  return r.data;
}

export async function getSections(): Promise<Section[]> {
  const r = await apiFetch<Section[]>("/v1/public/sections");
  return r.data;
}

export async function getSection(slug: string): Promise<Section> {
  const r = await apiFetch<Section>(`/v1/public/sections/${slug}`);
  return r.data;
}

// ── Analytics ─────────────────────────────────────────────────────────────────

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
      keepalive: true, // works even during page unload
    });
  } catch {
    // analytics is best-effort
  }
}
