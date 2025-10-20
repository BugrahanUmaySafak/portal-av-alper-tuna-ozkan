// src/components/Logout/Logout.tsx
"use client";

import { toast } from "sonner";
import { Button } from "../ui/button";
import { useEffect, useState, useTransition } from "react";

export default function Logout() {
  // 👇 SSR hydration hatasını önlemek için: önce mount olsun, sonra render et
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [isPending, startTransition] = useTransition();

  async function confirmAndLogout() {
    toast("Çıkış yapmak istediğinize emin misiniz?", {
      action: {
        label: "Evet",
        onClick: async () => {
          startTransition(async () => {
            try {
              const res = await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
              });
              if (res.ok) {
                toast.success("Başarıyla çıkış yapıldı.");
                window.location.replace("/");
              } else {
                toast.error("Çıkış yapılamadı, tekrar deneyin.");
              }
            } catch {
              toast.error("Sunucuya ulaşılamadı.");
            }
          });
        },
      },
      cancel: {
        label: "Vazgeç",
        onClick: () => {},
      },
    });
  }

  if (!mounted) return null; // 🔥 SSR'da render etme → hydration mismatch biter

  return (
    <Button
      onClick={confirmAndLogout}
      variant="destructive"
      size="sm"
      className="font-medium"
      disabled={isPending}
    >
      {isPending ? "Çıkış yapılıyor..." : "Çıkış Yap"}
    </Button>
  );
}
