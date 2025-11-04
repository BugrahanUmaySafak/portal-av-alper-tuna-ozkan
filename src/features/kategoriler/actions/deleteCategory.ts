"use client";

import { apiFetch } from "@/lib/api";

export async function deleteCategory(id: string) {
  // 204 döner; apiFetch 204'te undefined döndürür
  await apiFetch<void>(`/api/kategoriler/${id}`, { method: "DELETE" });
}
