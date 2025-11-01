// src/features/auth/hooks/useLogin.ts
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/features/auth/actions/login";

export function useLogin() {
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState("");
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login({ username, password });
      router.replace("/anasayfa");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Giriş başarısız";
      setErr(message);
    } finally {
      setLoading(false);
    }
  }

  return { username, password, setU, setP, loading, error, submit };
}
