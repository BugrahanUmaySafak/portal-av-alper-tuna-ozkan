"use client";

import type { Article } from "../types";

type ArticlePatchWire = Omit<Partial<Article>, "category" | "categoryId"> & {
  // backend article.controller.ts kategori için categoryId bekliyor
  categoryId?: string;
};

export async function updateArticle(id: string, patch: Partial<Article>) {
  const body: ArticlePatchWire = {
    ...patch,
    // 👇 eğer panelden categoryId geldiyse onu direkt al
    categoryId: patch.categoryId,
  };

  const res = await fetch(`/api/makalelerim/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error((await res.text()) || "Güncelleme başarısız");
  return res.json();
}
