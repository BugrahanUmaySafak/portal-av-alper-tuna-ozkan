// src/app/makalelerim/[slug]/page.tsx
import ArticleDetailInline from "@/features/makalelerim/containers/ArticleDetailInline";
import { notFound } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001";

async function fetchArticle(slug: string) {
  const res = await fetch(`${API_BASE}/api/makalelerim/${slug}`, {
    cache: "no-store",
    next: { revalidate: 0 },
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
  const article = await fetchArticle(slug);
  if (!article) notFound();
  return <ArticleDetailInline initial={article} />;
}
