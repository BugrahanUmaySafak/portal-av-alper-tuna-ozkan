// src/features/Anasayfa/Components/LatestArticle.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SmartFigureImage from "@/components/media/SmartFigureImage";
import { CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  const router = useRouter();
  const { data: articles, isLoading, isError } = useArticles();

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

      <div
        role="button"
        onClick={() => router.push("/makalelerim")}
        className="cursor-pointer select-none"
      >
        <div className="pointer-events-none">
          <Link href={`/makalelerim/${a.slug}`} className="block">
            {/* p-0: iç boşluk yok; overflow-hidden+rounded sadece kartta */}
            <Card className="group flex flex-col overflow-hidden rounded-xl border-0 shadow-sm hover:shadow-md transition p-0">
              <SmartFigureImage
                src={a.image.url}
                tinySrc={a.image.tinyUrl}
                alt={a.image.alt}
                /* Kartın üst kenarında 1px dikişi yok etmek için bindir */
                className="w-full h-48 sm:h-56 lg:h-60 -mt-px"
                withBottomGradient={false}
              />

              <CardHeader className="pb-1">
                <CardTitle className="text-lg font-semibold leading-7">
                  {a.title}
                </CardTitle>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  {formatTR(a.publishedAt)}
                </div>
              </CardHeader>

              <CardContent className="pb-4">
                <div className="flex flex-wrap gap-2">
                  {a.keywords.slice(0, 3).map((k) => (
                    <Badge key={k}>{k}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
