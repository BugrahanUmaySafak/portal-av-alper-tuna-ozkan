"use client";

import type { Video } from "@/features/videolarim/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001";

export async function getVideoById(id: string): Promise<Video> {
  const res = await fetch(`${API_BASE}/api/videolarim/${id}`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const msg =
      (await res.json().catch(() => null))?.message || "Video bulunamadı";
    throw new Error(msg);
  }

  const v = await res.json();

  let category: Video["category"] = undefined;
  if (v.category) {
    if (typeof v.category === "object" && v.category._id) {
      category = { id: String(v.category._id), name: v.category.name };
    } else if (typeof v.category === "object" && v.category.id) {
      category = { id: String(v.category.id), name: v.category.name };
    }
  }

  return {
    id: v.id ?? v._id ?? id,
    title: v.title,
    youtubeId: v.youtubeId,
    createdAt: v.createdAt ?? new Date().toISOString(),
    updatedAt: v.updatedAt ?? undefined,
    coverUrl: v.coverUrl || undefined,
    coverPublicId: v.coverPublicId || undefined,
    category,
  };
}
