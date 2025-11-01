"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Container from "@/components/container/Container";
import Section from "@/components/section/Section";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import SmartFigureImage from "@/components/media/SmartFigureImage";
import ArticleDelete from "./ArticleDelete";
import { useArticles } from "../actions/useArticles";
import type { Article } from "../types";

function formatTR(iso?: string) {
  if (!iso) return "Tarih yok";

  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Tarih yok";

  return d.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ArticlesList({
  initialItems = [],
}: {
  initialItems?: Article[];
}) {
  const router = useRouter();
  const {
    data: articles,
    error,
    isLoading,
  } = useArticles(initialItems.length ? initialItems : undefined);

  const isError = Boolean(error);

  // 1) LOADING — videolardakiyle aynı düzen
  if (isLoading) {
    return (
      <Section>
        <Container>
          <div className="flex items-center mb-6">
            <Button onClick={() => router.push("/makalelerim/new")}>
              Yeni Makale Ekle
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        </Container>
      </Section>
    );
  }

  // 2) ERROR
  if (isError) {
    return (
      <Section>
        <Container>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Makalelerim</h1>
            <Button onClick={() => router.push("/makalelerim/new")}>
              Yeni Makale Ekle
            </Button>
          </div>

          <div className="text-center py-16 text-destructive">
            {error instanceof Error
              ? error.message
              : "Makaleler alınırken bir hata oluştu."}
          </div>
        </Container>
      </Section>
    );
  }

  // 3) BOŞ
  if (!articles?.length) {
    return (
      <Section>
        <Container>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Makalelerim</h1>
            <Button onClick={() => router.push("/makalelerim/new")}>
              Yeni Makale Ekle
            </Button>
          </div>

          <div className="text-center py-16 text-muted-foreground">
            Gösterilecek makale bulunamadı.
          </div>
        </Container>
      </Section>
    );
  }

  // 4) DOLU
  return (
    <Section>
      <Container>
        <div className="flex items-center mb-6">
          <Button onClick={() => router.push("/makalelerim/new")}>
            Yeni Makale Ekle
          </Button>
        </div>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a, idx) => (
            <Link
              key={a.id}
              href={`/makalelerim/${a.slug}`}
              className="block h-full"
              prefetch={false}
            >
              <Card className="group h-full flex flex-col overflow-hidden transition hover:shadow-lg p-0 border-0 rounded-xl">
                {/* GÖRSEL + SİL */}
                <div className="relative w-full h-56 sm:h-60 lg:h-64 rounded-t-xl overflow-hidden">
                  {/* sil butonu sağ üst — videolardakiyle aynı */}
                  <div className="absolute right-3 top-3 z-20">
                    <ArticleDelete
                      id={a.id}
                      onDeleted={() => {
                        // en kolay yol: sayfayı yenilet
                        router.refresh();
                      }}
                    />
                  </div>

                  <SmartFigureImage
                    src={a.image.url}
                    tinySrc={a.image.tinyUrl ?? a.image.url}
                    alt={a.image.alt}
                    priority={idx === 0}
                    className="w-full h-full object-cover"
                  />
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold leading-8">
                    {a.title}
                  </CardTitle>

                  <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4" />
                      {formatTR(a.createdAt ?? a.updatedAt)}
                    </span>
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
          ))}
        </div>
      </Container>
    </Section>
  );
}
