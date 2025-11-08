"use client";

import { apiFetch } from "@/lib/api";

export async function deleteArticle(id: string) {
  await apiFetch<void>(`/makalelerim/${id}`, { method: "DELETE" });
}
