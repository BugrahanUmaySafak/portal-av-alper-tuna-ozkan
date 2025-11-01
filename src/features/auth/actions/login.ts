// src/features/auth/actions/login.ts
"use client";

/**
 * Client tarafında login isteği atar.
 * API: http://localhost:4001/api/auth/login
 */
export async function login(payload: { username: string; password: string }) {
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001";

  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let msg = "Giriş başarısız";
    try {
      const data = await res.json();
      if (data?.message === "invalid_credentials") {
        msg = "Kullanıcı adı veya şifre hatalı";
      } else if (data?.message) {
        msg = data.message;
      }
    } catch {
      // no-op
    }
    throw new Error(msg);
  }

  return res.json();
}
