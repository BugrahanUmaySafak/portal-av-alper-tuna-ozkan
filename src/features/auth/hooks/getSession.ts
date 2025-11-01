import { headers } from "next/headers";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001";

/**
 * SSR'da oturum kontrolü: backend /api/auth/me
 */
export async function getSession(): Promise<{ username: string } | null> {
  const h = await headers();
  const cookie = h.get("cookie") ?? "";

  const res = await fetch(`${API_BASE}/api/auth/me`, {
    cache: "no-store",
    headers: { cookie },
  });

  if (!res.ok) return null;

  const data = (await res.json().catch(() => null)) as {
    ok: true;
    user: { username: string };
  } | null;

  return data?.user ?? null;
}
