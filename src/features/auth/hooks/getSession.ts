import { headers } from "next/headers";

/**
 * SSR'da oturum kontrolü: backend /api/auth/me
 */
export async function getSession(): Promise<{ username: string } | null> {
  const h = await headers();
  const cookie = h.get("cookie") ?? "";

  // Dev: site URL'in
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";

  const res = await fetch(`${site}/api/auth/me`, {
    cache: "no-store",
    headers: { cookie },
  });

  if (res.status !== 200) return null;

  const data = (await res.json().catch(() => null)) as {
    ok: true;
    user: { username: string };
  } | null;

  return data?.user ?? null;
}
