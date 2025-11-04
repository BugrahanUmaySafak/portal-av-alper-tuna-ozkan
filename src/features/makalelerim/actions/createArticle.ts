"use server";

import { cookies } from "next/headers";
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

export async function createArticle(
  payload: CreateArticlePayload,
  file?: File
) {
  const cookie = (await cookies()).toString();

  if (file) {
    const form = new FormData();
    form.append("data", JSON.stringify(payload));
    form.append("file", file);

    const res = await fetch(`${API_BASE}/api/makalelerim`, {
      method: "POST",
      body: form,
      cache: "no-store",
      credentials: "include",
      headers: { cookie }, // 🔑 auth forward
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(txt || "Makale oluşturulamadı");
    }
    return res.json();
  }

  const res = await fetch(`${API_BASE}/api/makalelerim`, {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie }, // 🔑
    body: JSON.stringify(payload),
    cache: "no-store",
    credentials: "include",
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "Makale oluşturulamadı");
  }
  return res.json();
}
