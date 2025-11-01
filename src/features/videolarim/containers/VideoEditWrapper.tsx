// src/features/videolarim/containers/VideoEditWrapper.tsx
"use client";

import Container from "@/components/container/Container";
import Section from "@/components/section/Section";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import VideoEdit from "@/features/videolarim/components/VideoEdit";
import { useVideo } from "@/features/videolarim/hooks/useVideo";

export default function VideoEditWrapper({ id }: { id: string }) {
  const { video, isLoading, isError, error, mutate } = useVideo(id);

  if (isLoading) {
    return (
      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-[360px]" />
            <Skeleton className="h-[360px]" />
          </div>
        </Container>
      </Section>
    );
  }

  if (isError || !video) {
    return (
      <Section>
        <Container>
          <Card>
            <CardContent className="p-6">
              <p className="text-destructive">
                {error instanceof Error ? error.message : "Video bulunamadı."}
              </p>
            </CardContent>
          </Card>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <VideoEdit initial={video} onUpdated={() => mutate()} />
      </Container>
    </Section>
  );
}
