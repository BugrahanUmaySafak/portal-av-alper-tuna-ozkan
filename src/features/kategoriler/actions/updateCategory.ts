"use client";

import { apiFetch } from "@/lib/api";

export async function updateCategory(id: string, name: string) {
  const body = { name };
  // API: PATCH /api/kategoriler/:id → { id, name }
  return apiFetch<{ id: string; name: string }>(`/kategoriler/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}
