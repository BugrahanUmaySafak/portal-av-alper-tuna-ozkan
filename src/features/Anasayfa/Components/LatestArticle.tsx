"use client";

import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SmartFigureImage from "@/components/media/SmartFigureImage";
import { CalendarDays } from "lucide-react";
import { useArticles } from "@/features/makalelerim/actions/useArticles";
import type { Article } from "@/features/makalelerim/types";

function formatTR(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function LatestArticle() {
  const { articles, isLoading, isError } = useArticles();

  if (isLoading) return <Skeleton className="h-28 w-full max-w-xl" />;

  if (isError || !articles?.length) {
    return (
      <div className="text-muted-foreground text-base">
        Henüz makale bulunamadı.
      </div>
    );
  }

  const a: Article = articles[0];

  return (
    <div className="space-y-3 max-w-xl">
      <h2 className="text-xl font-semibold">Son Yayınlanan Makale</h2>

      <Link href={`/makalelerim/${a.slug}`} className="block">
        <Card className="group h-full flex flex-col overflow-hidden transition hover:shadow-lg p-0 border-0 rounded-xl">
          {/* Görsel: kartın ilk çocuğu, ekstra spacing yok */}
          <SmartFigureImage
            src={a.image.url}
            alt={a.image.alt}
            className="w-full h-48 sm:h-56 lg:h-60" // ArticlesList ile aynı yükseklik mantığı
          />

          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold leading-8">
              {a.title}
            </CardTitle>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              {formatTR(a.publishedAt)}
            </div>
          </CardHeader>

          <CardContent className="mb-4">
            <div className="flex flex-wrap gap-2">
              {a.keywords.slice(0, 3).map((k) => (
                <Badge key={k}>{k}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
