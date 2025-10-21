"use client";

export async function deleteArticle(id: string) {
  const res = await fetch(`/api/makalelerim/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || "Makale silinemedi");
  }
}
