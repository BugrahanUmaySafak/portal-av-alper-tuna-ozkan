"use client";

import Link from "next/link";
import Container from "@/components/container/Container";
import Section from "@/components/section/Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import SmartFigureImage from "@/components/media/SmartFigureImage";
import { useArticles } from "@/features/makalelerim/actions/useArticles";
import type { Article } from "@/features/makalelerim/types";
import { Skeleton } from "@/components/ui/skeleton";
import ArticleDelete from "./ArticleDelete";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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

export default function ArticlesList({
  initialItems,
}: {
  initialItems?: Article[];
}) {
  const router = useRouter();
  const { articles, isLoading, isError, error, mutate } =
    useArticles(initialItems);

  if (isLoading) {
    return (
      <Section>
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-xl" />
            ))}
          </div>
        </Container>
      </Section>
    );
  }

  if (isError) {
    return (
      <Section>
        <Container>
          <p className="text-destructive">
            {error instanceof Error ? error.message : "Bir hata oluştu."}
          </p>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <Button
          onClick={() => router.push("/makalelerim/new")}
          className="mb-6"
        >
          Yeni Makale Ekle
        </Button>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <Link
              key={a.id}
              href={`/makalelerim/${a.slug}`}
              className="block h-full"
            >
              <Card className="group h-full flex flex-col overflow-hidden transition hover:shadow-lg p-0 border-0 rounded-xl">
                <div className="relative">
                  <SmartFigureImage
                    src={a.image.url}
                    alt={a.image.alt}
                    className="w-full h-56 sm:h-60 lg:h-64 rounded-t-xl"
                  />
                  <div className="absolute left-2 top-2 z-10">
                    <ArticleDelete
                      id={a.id}
                      onDeleted={() => {
                        mutate(
                          (prev?: { items: Article[] }) =>
                            prev
                              ? {
                                  items: prev.items.filter(
                                    (x) => x.id !== a.id
                                  ),
                                }
                              : prev,
                          { revalidate: false }
                        );
                      }}
                    />
                  </div>
                </div>

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
          ))}
        </div>
      </Container>
    </Section>
  );
}
