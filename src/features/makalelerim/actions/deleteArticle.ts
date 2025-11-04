"use client";

import { apiFetch } from "@/lib/api";

export async function deleteArticle(id: string) {
  await apiFetch<void>(`/api/makalelerim/${id}`, { method: "DELETE" });
}
