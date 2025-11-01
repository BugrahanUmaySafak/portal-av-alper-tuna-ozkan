"use client";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001";
const CATEGORIES_URL = `${API_BASE}/api/kategoriler`;

export async function deleteCategory(id: string) {
  const res = await fetch(`${CATEGORIES_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (res.status === 204) return;

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const msg =
      (json && typeof json === "object" && "message" in json && json.message) ||
      (typeof json === "string" ? json : "") ||
      "Kategori silinemedi";
    throw new Error(msg);
  }
}
