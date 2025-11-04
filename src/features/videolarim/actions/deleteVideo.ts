"use client";

import { apiFetch } from "@/lib/api";

export async function deleteVideo(id: string) {
  await apiFetch<void>(`/api/videolarim/${id}`, { method: "DELETE" });
}
