"use server";

import { cookies } from "next/headers";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api.alpertunaozkan.com/api";

export async function serverLogout() {
  const cookieStore = cookies(); // serialize tüm cookie'ler
  await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    cache: "no-store",
    credentials: "include",
    headers: {
      cookie: cookieStore.toString(),
    },
  });
}
