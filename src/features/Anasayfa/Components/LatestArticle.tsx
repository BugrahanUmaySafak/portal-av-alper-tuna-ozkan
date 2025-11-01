"use client";

import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SmartFigureImage from "@/components/media/SmartFigureImage";
import { CalendarDays } from "lucide-react";
import { useArticles } from "@/features/makalelerim/actions/useArticles";
import type { Article } from "@/features/makalelerim/types";

function formatTR(iso: string) {
  if (!iso) return "";
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

  if (isLoading) {
    return <Skeleton className="h-[320px] w-full max-w-[380px]" />;
  }

  if (isError || !articles?.length) {
    return (
      <div className="w-full max-w-[380px] space-y-2">
        <h2 className="text-lg md:text-xl font-semibold">
          Son Yayınlanan Makale
        </h2>
        <p className="text-sm text-muted-foreground">
          Henüz makale bulunamadı.
        </p>
      </div>
    );
  }

  const a: Article = articles[0];
  const dateToShow = a.createdAt;

  return (
    <div className="w-full max-w-[380px] space-y-3">
      <h2 className="text-lg md:text-xl font-semibold">
        Son Yayınlanan Makale
      </h2>

      <div
        role="button"
        tabIndex={0}
        onClick={() => router.push("/makalelerim")}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") router.push("/makalelerim");
        }}
        className="block w-full cursor-pointer rounded-2xl transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
        aria-label="Makalelerim sayfasına git"
      >
        {/* içeriği devre dışı bırakıyoruz ki içinde buton/embed olsa bile nested button hatası vermesin */}
        <div className="pointer-events-none">
          <Card className="group h-full flex flex-col overflow-hidden transition hover:shadow-lg p-0 border-0 rounded-xl">
            <SmartFigureImage
              src={a.image.url}
              tinySrc={a.image.tinyUrl ?? a.image.url}
              alt={a.image.alt}
              className="w-full h-56 sm:h-60 lg:h-64 rounded-t-xl"
            />

            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold leading-8 line-clamp-2">
                {a.title}
              </CardTitle>

              <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  {dateToShow ? formatTR(dateToShow) : "Tarih yok"}
                </span>
              </div>
            </CardHeader>

            <CardContent className="mb-4">
              <div className="flex flex-wrap gap-2">
                {a.keywords?.slice(0, 3).map((k) => (
                  <Badge key={k}>{k}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
