"use client";

import type { Video } from "@/features/videolarim/types";
import { apiFetch } from "@/lib/api";

export async function getVideoById(id: string): Promise<Video> {
  return apiFetch<Video>(`/videolarim/${id}`);
}
