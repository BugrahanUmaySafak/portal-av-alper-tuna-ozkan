"use client";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001";

type ErrorResponse = { message?: string };

export async function deleteVideo(id: string) {
  const res = await fetch(`${API_BASE}/api/videolarim/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (res.status === 204) return { ok: true as const };

  const json = (await res.json().catch(() => null)) as ErrorResponse | null;

  const msg =
    json?.message ||
    (typeof json === "string" ? json : "") ||
    "Video silinemedi";

  throw new Error(msg);
}
