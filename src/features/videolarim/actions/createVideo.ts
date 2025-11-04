"use client";

import type { Video } from "@/features/videolarim/types";
import { apiFetch } from "@/lib/api";

export async function createVideo(payload: {
  title: string;
  youtubeId: string;
  categoryId?: string;
}): Promise<Video> {
  return apiFetch<Video>("/api/videolarim", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
