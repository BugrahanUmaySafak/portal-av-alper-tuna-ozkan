"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/features/auth/actions/login";

export function useLogin() {
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState("");
  const router = useRouter();
  const search = useSearchParams();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login({ username, password });
      const redirectTo = search.get("redirect");
      router.replace(
        redirectTo && redirectTo.startsWith("/") ? redirectTo : "/anasayfa"
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Giriş başarısız";
      setErr(message);
    } finally {
      setLoading(false);
    }
  }

  return { username, password, setU, setP, loading, error, submit };
}
