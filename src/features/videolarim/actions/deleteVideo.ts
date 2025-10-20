"use client";

type ErrorResponse = { message?: string };
function isError(x: unknown): x is ErrorResponse {
  return typeof x === "object" && x !== null && "message" in x;
}

export async function deleteVideo(id: string) {
  const res = await fetch(`/api/videolarim/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (res.status === 204) return { ok: true as const };

  let msg = "Video silinemedi";
  try {
    const data: unknown = await res.json();
    if (isError(data) && data.message) msg = data.message;
  } catch {}
  throw new Error(msg);
}
