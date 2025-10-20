// src/features/videolarim/actions/client/getVideoById.ts
"use client";

import type { Video } from "@/features/videolarim/types";

export async function getVideoById(id: string): Promise<Video> {
  const res = await fetch(`/api/videolarim/${id}`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) {
    const msg =
      (await res.json().catch(() => null))?.message || "Video bulunamadı";
    throw new Error(msg);
  }
  return res.json();
}
