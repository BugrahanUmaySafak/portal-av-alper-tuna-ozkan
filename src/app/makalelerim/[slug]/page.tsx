// app/makalelerim/[slug]/page.tsx
import ArticleDetailInline from "@/features/makalelerim/containers/ArticleDetailInline";
import { notFound } from "next/navigation";

async function fetchArticle(slug: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";
  const res = await fetch(`${base}/api/makalelerim/${slug}`, {
    cache: "no-store",
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
