// src/features/makalelerim/actions/uploadArticleImage.ts
"use client";

// görsel upload (ID ile)
type UploadJson = { image?: { url?: string; tinyUrl?: string } };

/**
 * Makale görselini tek başına (FormData) günceller.
 * BE { image: { url, tinyUrl } } döner; ikisini de dışarı veririz.
 */
export async function uploadArticleImageWithId(
  file: File,
  slug: string,
  id: string
): Promise<{ url: string; tinyUrl?: string }> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("data", JSON.stringify({ slug }));

  const res = await fetch(`/api/makalelerim/${id}`, {
    method: "PATCH",
    credentials: "include",
    body: fd,
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "Görsel yüklenemedi");
  }

  const json: UploadJson = await res.json();
  return { url: json.image?.url ?? "", tinyUrl: json.image?.tinyUrl };
}
