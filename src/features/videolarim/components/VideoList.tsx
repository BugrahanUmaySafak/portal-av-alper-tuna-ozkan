// src/features/videolarim/components/VideoList.tsx (panel)
"use client";

import { useRouter } from "next/navigation";
import Container from "@/components/container/Container";
import Section from "@/components/section/Section";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import VideoCard from "@/features/videolarim/components/VideoCard";
import { useVideos } from "@/features/videolarim/hooks/useVideos";

export default function VideoList() {
  const router = useRouter();
  const { videos, isLoading, isError, error } = useVideos();

  if (isLoading) {
    return (
      <Section>
        <Container>
          <Button
            onClick={() => router.push("/videolarim/new")}
            className="text-base mb-6"
          >
            Yeni Video Ekle
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-60 w-full" />
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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Videolarım</h1>
            <Button
              onClick={() => router.push("/videolarim/new")}
              className="text-base"
            >
              Yeni Video Ekle
            </Button>
          </div>

          <div className="text-center py-16 text-destructive">
            {error instanceof Error ? error.message : "Bir hata oluştu."}
          </div>
        </Container>
      </Section>
    );
  }

  if (!videos?.length) {
    return (
      <Section>
        <Container>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Videolarım</h1>
            <Button
              onClick={() => router.push("/videolarim/new")}
              className="text-base"
            >
              Yeni Video Ekle
            </Button>
          </div>

          <div className="text-center py-16 text-muted-foreground">
            Gösterilecek video bulunamadı.
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <div className="flex items-center mb-6">
          <Button onClick={() => router.push("/videolarim/new")}>
            Yeni Video Ekle
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((v, i) => (
            <VideoCard
              key={v.id}
              {...v}
              priority={i === 0}
              // onDeleted VERMİYORUZ → VideoDelete kendi içinde reload yapıyor
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
