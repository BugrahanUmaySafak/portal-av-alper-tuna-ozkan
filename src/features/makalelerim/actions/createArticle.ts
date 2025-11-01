"use server";

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

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001";

export async function createArticle(
  payload: CreateArticlePayload,
  file?: File
) {
  // form-data ile gönderilen senaryo
  if (file) {
    const form = new FormData();
    form.append("data", JSON.stringify(payload));
    form.append("file", file);

    const res = await fetch(`${API_BASE}/api/makalelerim`, {
      method: "POST",
      body: form,
      cache: "no-store",
      credentials: "include",
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  // normal JSON senaryosu
  const res = await fetch(`${API_BASE}/api/makalelerim`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
