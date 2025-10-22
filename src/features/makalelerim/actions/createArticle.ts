// src/features/makalelerim/actions/createArticle.ts
"use server";

export type CreateArticlePayload = {
  title: string;
  content: string;
  slug: string;
  image: { url?: string; alt: string };
  keywords?: string[];
  seo: { title: string; description: string; canonicalUrl: string };
};

export async function createArticle(
  payload: CreateArticlePayload,
  file?: File
) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";
  if (file) {
    const form = new FormData();
    form.append("data", JSON.stringify(payload));
    form.append("file", file);
    const res = await fetch(`${base}/api/makalelerim`, {
      method: "POST",
      body: form,
      cache: "no-store",
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
  const res = await fetch(`${base}/api/makalelerim`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
