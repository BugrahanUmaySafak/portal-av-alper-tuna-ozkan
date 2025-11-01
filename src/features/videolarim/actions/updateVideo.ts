"use client";

import type { Video } from "@/features/videolarim/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001";

export async function updateVideo(
  id: string,
  payload: {
    title?: string;
    youtubeId?: string;
    categoryId?: string;
  }
): Promise<Video> {
  const res = await fetch(`${API_BASE}/api/videolarim/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = json?.message || "Video güncellenemedi";
    throw new Error(msg);
  }

  return json as Video;
}
