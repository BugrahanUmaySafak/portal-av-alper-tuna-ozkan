"use client";

type ErrorResponse = { message?: string };

function isErrorResponse(x: unknown): x is ErrorResponse {
  return typeof x === "object" && x !== null && "message" in x;
}

export async function deleteContact(id: string) {
  const res = await fetch(`/api/iletisim/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (res.status === 204) return { ok: true as const };

  let msg = "Kayıt silinemedi";
  try {
    const data: unknown = await res.json();
    if (isErrorResponse(data) && data.message) msg = data.message;
  } catch {
    // body yoksa / JSON parse edilemediyse varsayılan mesajı kullan
  }
  throw new Error(msg);
}
