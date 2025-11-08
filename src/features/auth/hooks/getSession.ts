import { headers } from "next/headers";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api.alpertunaozkan.com";

/**
 * SSR'da oturum kontrolü: backend /api/auth/me
 */
export async function getSession(): Promise<{ username: string } | null> {
  const h = await headers();
  const cookie = h.get("cookie") ?? "";

  const res = await fetch(`${API_BASE}/api/auth/me`, {
    cache: "no-store",
    credentials: "include",
    headers: { cookie },
  });

  if (!res.ok) return null;

  try {
    const data = (await res.json()) as {
      ok: true;
      user: { username: string };
    };
    return data?.user ?? null;
  } catch {
    return null;
  }
}
