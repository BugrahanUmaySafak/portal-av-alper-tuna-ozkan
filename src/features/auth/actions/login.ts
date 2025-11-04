"use client";

/**
 * Client tarafında login isteği atar.
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
    // JSON veya text dönse de güvenle oku
    let msg = "Giriş başarısız";
    try {
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const data = await res.json();
        if (data?.message === "invalid_credentials")
          msg = "Kullanıcı adı veya şifre hatalı";
        else if (data?.message) msg = data.message;
      } else {
        const text = await res.text();
        if (text) msg = text;
      }
    } catch {
      /* no-op */
    }
    throw new Error(msg);
  }

  return res.json();
}
