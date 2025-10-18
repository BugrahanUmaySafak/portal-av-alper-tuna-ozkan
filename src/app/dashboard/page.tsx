"use client";
import { serverLogout } from "@/features/auth/actions/logout";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const r = useRouter();
  return (
    <button
      onClick={async () => {
        await serverLogout();
        r.replace("/");
      }}
    >
      Çıkış Yap
    </button>
  );
}
