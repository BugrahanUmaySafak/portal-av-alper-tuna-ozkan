"use client";

type ErrorResponse = { message?: string };

function isErrorResponse(x: unknown): x is ErrorResponse {
  return typeof x === "object" && x !== null && "message" in x;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001";

export async function deleteContact(id: string) {
  const res = await fetch(`${API_BASE}/api/iletisim/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (res.status === 204) return { ok: true as const };

  let msg = "Kayıt silinemedi";
  try {
    const data: unknown = await res.json();
    if (isErrorResponse(data) && data.message) msg = data.message;
  } catch {}
  throw new Error(msg);
}
