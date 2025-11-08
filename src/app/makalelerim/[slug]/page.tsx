// src/app/makalelerim/[slug]/page.tsx
import ArticleDetailInline from "@/features/makalelerim/containers/ArticleDetailInline";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api.alpertunaozkan.com/api";

async function fetchArticle(slug: string, cookie: string) {
  const res = await fetch(`${API_BASE}/makalelerim/${slug}`, {
    cache: "no-store",
    next: { revalidate: 0 },
    credentials: "include",
    headers: { cookie },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cookie = (await headers()).get("cookie") ?? "";
  const article = await fetchArticle(slug, cookie);
  if (!article) notFound();
  return <ArticleDetailInline initial={article} />;
}
