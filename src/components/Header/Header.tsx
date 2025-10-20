// components/header/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Logout from "../Logout/Logout";
import Container from "../container/Container";

export default function Header() {
  const pathname = usePathname();

  const links = [
    { href: "/anasayfa", label: "Anasayfa" },
    { href: "/iletisim", label: "İletişim" },
    { href: "/makalelerim", label: "Makalelerim" },
    { href: "/videolarim", label: "Videolarım" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <Container>
        {/* 
          ≤832px: h-[73.3px]  (mobile)
          ≥833px: min-h-[72px] (tablet/desktop)
        */}
        <div className="flex items-center justify-between gap-6 max-[832px]:h-[73.3px] min-[833px]:min-h-[72px]">
          {/* Sol: Nav */}
          <nav className="flex items-center gap-6 sm:gap-8">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-1 py-2 text-base sm:text-lg font-medium transition-colors",
                    "hover:text-primary",
                    active
                      ? "text-primary after:absolute after:-bottom-[6px] after:left-0 after:h-[3px] after:w-full after:bg-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Sağ: Logout */}
          <div className="ml-auto">
            <Logout />
          </div>
        </div>
      </Container>
    </header>
  );
}
