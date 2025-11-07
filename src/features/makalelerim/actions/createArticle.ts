"use client";

import { apiFetch } from "@/lib/api";

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

/** Cloudinary'e yükle ve secure_url döndür */
async function uploadToCloudinary(file: File): Promise<string> {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloud || !preset) {
    throw new Error(
      "Görsel yükleme yapılandırması eksik (Cloudinary). Ortamlara NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ve NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ekleyin."
    );
  }

  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", preset);

  // İsteğin hedefi direkt Cloudinary API
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud}/image/upload`,
    {
      method: "POST",
      body: fd,
    }
  );

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "Görsel Cloudinary'e yüklenemedi.");
  }

  const json = (await res.json()) as { secure_url?: string };
  if (!json.secure_url) throw new Error("Cloudinary URL dönmedi.");
  return json.secure_url;
}

/**
 * Tek butonla aynı UX:
 * 1) (varsa) dosyayı Cloudinary'e yükle, URL al
 * 2) URL'yi image.url olarak API'ye JSON ile gönder
 */
export async function createArticle(
  payload: CreateArticlePayload,
  file?: File | null
): Promise<CreatedArticle> {
  let imageUrl = payload.image?.url || "";

  if (file) {
    imageUrl = await uploadToCloudinary(file);
  }

  const body: CreateArticlePayload = {
    ...payload,
    image: { url: imageUrl, alt: payload.image?.alt || "" },
  };

  // Artık sadece JSON gönderiyoruz
  return apiFetch<CreatedArticle>("/api/makalelerim", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
