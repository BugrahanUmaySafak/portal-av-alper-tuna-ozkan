"use client";

import type { Video } from "@/features/videolarim/types";
import { apiFetch } from "@/lib/api";

export async function updateVideo(
  id: string,
  payload: { title?: string; youtubeId?: string; categoryId?: string }
): Promise<Video> {
  return apiFetch<Video>(`/api/videolarim/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
