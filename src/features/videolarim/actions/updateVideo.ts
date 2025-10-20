// src/features/videolarim/actions/client/updateVideo.ts
"use client";

export async function updateVideo(
  id: string,
  payload: { title?: string; youtubeId?: string }
) {
  const res = await fetch(`/api/videolarim/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const msg =
      (await res.json().catch(() => null))?.message || "Video güncellenemedi";
    throw new Error(msg);
  }
  return res.json();
}
