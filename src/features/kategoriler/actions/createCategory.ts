"use client";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001";
const CATEGORIES_URL = `${API_BASE}/api/kategoriler`;

export async function createCategory(name: string) {
  const res = await fetch(CATEGORIES_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name }),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const msg =
      (json && typeof json === "object" && "message" in json && json.message) ||
      (typeof json === "string" ? json : "") ||
      "Kategori eklenemedi";
    throw new Error(msg);
  }

  return json;
}
