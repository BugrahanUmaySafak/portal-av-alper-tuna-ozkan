"use client";

import type { Video } from "@/features/videolarim/types";

export async function createVideo(payload: {
  title: string;
  youtubeId: string;
}): Promise<Video> {
  const res = await fetch("/api/videolarim", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const msg =
      data?.message ||
      (data?.errors ? "Form doğrulama hatası" : "Video oluşturulamadı");
    throw new Error(msg);
  }

  return res.json();
}
