"use client";

import { API_BASE, apiFetch } from "@/lib/api";

export type CreateArticlePayload = {
  title: string;
  slug: string;
  content: string;
  image: { url?: string; alt: string };
  keywords?: string[];
  summary?: string;
  categoryId?: string;
  readingMinutes?: number;
};

type CreatedArticle = { id: string } & Record<string, unknown>;

/**
 * Tek butonla aynı UX; arkada:
 * 1) JSON ile makaleyi oluştur
 * 2) Varsa dosyayı doğrudan API'ye PATCH et (FormData)
 */
export async function createArticle(
  payload: CreateArticlePayload,
  file?: File | null
): Promise<CreatedArticle> {
  // 1) JSON
  const created = await apiFetch<CreatedArticle>("/api/makalelerim", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  // 2) Görsel (varsa) — tarayıcıdan doğrudan API'ye
  if (file) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("data", JSON.stringify({ slug: payload.slug }));

    const res = await fetch(`${API_BASE}/api/makalelerim/${created.id}`, {
      method: "PATCH",
      body: fd,
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(
        txt || "Makale oluşturuldu fakat kapak görseli yüklenemedi."
      );
    }
  }

  return created;
}
