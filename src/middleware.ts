// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  // Sadece /dashboard ve alt yollar
  if (!pathname.startsWith("/dashboard")) return NextResponse.next();

  // 1) Cookie var mı? (logout sonrası en hızlı kontrol)
  const sid = req.cookies.get("sid")?.value;
  if (!sid) {
    const url = new URL("/", req.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // 2) Cookie var ama geçersiz olabilir → backend'e doğrulat
  const res = await fetch(`${origin}/api/auth/me`, {
    headers: { cookie: req.headers.get("cookie") ?? "" },
    cache: "no-store",
  });

  if (res.status === 200) return NextResponse.next();

  const url = new URL("/", req.url);
  url.searchParams.set("redirect", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
