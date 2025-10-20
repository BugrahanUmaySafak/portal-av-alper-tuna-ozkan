// components/Header/HeaderGate.tsx
"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

const SHOW_ON = ["/anasayfa", "/iletisim", "/makalelerim", "/videolarim"];

export default function HeaderGate() {
  const pathname = usePathname();
  const show = SHOW_ON.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  if (!show) return null;
  return <Header />;
}
