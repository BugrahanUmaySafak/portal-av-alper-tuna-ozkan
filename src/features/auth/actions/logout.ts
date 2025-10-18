// src/features/auth/actions/server/logout.ts
"use server";

import { cookies } from "next/headers";

export async function serverLogout() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";
  const cookieHeader = (await cookies()).toString(); // 🔥 aktif kullanıcının cookie’leri

  await fetch(`${site}/api/auth/logout`, {
    method: "POST",
    cache: "no-store",
    headers: { cookie: cookieHeader }, // 🔥 cookie’yi forward et
  });
}
