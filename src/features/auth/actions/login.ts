"use client";

/**
 * Client tarafında login isteği atar.
 * Rewrites ile /api → backend:4000
 * credentials: 'include' ile session cookie alınır.
 */
export async function login(payload: { username: string; password: string }) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let msg = "Giriş başarısız";
    try {
      const data = await res.json();
      if (data?.message === "invalid_credentials")
        msg = "Kullanıcı adı veya şifre hatalı";
      else if (data?.message) msg = data.message;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}
