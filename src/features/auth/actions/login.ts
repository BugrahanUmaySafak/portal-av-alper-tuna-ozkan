"use client";

import { apiFetch } from "@/lib/api";

/**
 * Client tarafında login isteği atar.
 */
export async function login(payload: { username: string; password: string }) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
