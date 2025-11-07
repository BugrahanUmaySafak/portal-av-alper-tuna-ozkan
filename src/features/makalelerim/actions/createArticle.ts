// src/features/makalelerim/actions/createArticle.ts
"use client";

import { API_BASE } from "@/lib/api";

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

export async function createArticle(payload: CreateArticlePayload, file: File) {
  const form = new FormData();
  form.append("data", JSON.stringify(payload));
  form.append("file", file);

  const res = await fetch(`${API_BASE}/api/makalelerim`, {
    method: "POST",
    body: form, // Content-Type KENDİSİ ayarlansın
    credentials: "include", // sid çerezi gönderilsin
    cache: "no-store",
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "Makale oluşturulamadı");
  }
  return res.json();
}
