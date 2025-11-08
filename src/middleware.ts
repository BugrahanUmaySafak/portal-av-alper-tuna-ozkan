// src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api.alpertunaozkan.com/api";

const PROTECTED = [
  "/anasayfa",
  "/iletisim",
  "/makalelerim",
  "/videolarim",
  "/kategoriler",
];

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (!PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  const sid = req.cookies.get("sid")?.value;
  if (!sid) {
    const url = new URL("/", req.url);
    url.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(url);
  }

  try {
    const apiRes = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        cookie: req.headers.get("cookie") ?? "",
      },
      credentials: "include",
      cache: "no-store",
    });

    if (apiRes.status === 200) {
      return NextResponse.next();
    }
  } catch {
    const url = new URL("/", req.url);
    url.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(url);
  }

  const url = new URL("/", req.url);
  url.searchParams.set("redirect", pathname + search);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/anasayfa",
    "/iletisim",
    "/makalelerim",
    "/makalelerim/:path*",
    "/videolarim",
    "/videolarim/:path*",
    "/kategoriler",
  ],
};
