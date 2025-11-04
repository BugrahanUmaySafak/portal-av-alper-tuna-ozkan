"use client";

import { apiFetch } from "@/lib/api";

// BE { image: { url, tinyUrl } } döner.
type UploadJson = { image?: { url?: string; tinyUrl?: string } };

export async function uploadArticleImageWithId(
  file: File,
  slug: string,
  id: string
): Promise<{ url: string; tinyUrl?: string }> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("data", JSON.stringify({ slug }));

  // apiFetch FormData'yı otomatik tanır ve Content-Type set etmez
  const json = await apiFetch<UploadJson>(`/api/makalelerim/${id}`, {
    method: "PATCH",
    body: fd,
  });

  return { url: json.image?.url ?? "", tinyUrl: json.image?.tinyUrl };
}
