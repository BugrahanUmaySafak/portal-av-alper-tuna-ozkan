"use client";

import { apiFetch } from "@/lib/api";

export async function deleteVideo(id: string) {
  await apiFetch<void>(`/videolarim/${id}`, { method: "DELETE" });
}
