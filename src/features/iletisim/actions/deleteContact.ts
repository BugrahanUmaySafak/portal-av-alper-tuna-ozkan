// src/features/iletisim/actions/deleteContact.ts
"use client";

import { apiFetch } from "@/lib/api";

type DeleteOk = { ok: true };

export async function deleteContact(id: string): Promise<DeleteOk> {
  // 204 bekliyoruz; apiFetch 204'te undefined döner.
  try {
    await apiFetch<void>(`/iletisim/${id}`, { method: "DELETE" });
    return { ok: true };
  } catch (e: unknown) {
    // Daha okunur hata
    const msg =
      e instanceof Error
        ? e.message
        : "Kayıt silinemedi. Lütfen tekrar deneyin.";
    throw new Error(msg);
  }
}
