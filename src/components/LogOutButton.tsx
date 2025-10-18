// components/LogoutButton.tsx
"use client";

export default function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include", // 🔥 tarayıcı cookie’sini gönderir
    });
    window.location.replace("/"); // veya router.replace("/")
  }
  return <button onClick={handleLogout}>Çıkış Yap</button>;
}
