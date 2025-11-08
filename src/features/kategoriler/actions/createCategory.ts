"use client";

import { apiFetch } from "@/lib/api";

export async function createCategory(name: string) {
  const body = { name };
  // API: POST /api/kategoriler  → { id, name }
  return apiFetch<{ id: string; name: string }>("/kategoriler", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
