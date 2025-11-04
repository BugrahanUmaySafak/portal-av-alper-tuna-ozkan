"use server";

import { cookies } from "next/headers";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001";

export async function serverLogout() {
  const cookieStore = cookies(); // await yok

  await fetch(`${API_BASE}/api/auth/logout`, {
    method: "POST",
    cache: "no-store",
    credentials: "include",
    headers: {
      cookie: cookieStore.toString(),
    },
  });
}
