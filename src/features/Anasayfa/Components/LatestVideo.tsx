"use client";

import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import VideoCard from "@/features/videolarim/components/VideoCard";
import type { Video } from "@/features/videolarim/types";
import { useVideos } from "@/features/videolarim/hooks/useVideos";

export default function LatestVideo() {
  const router = useRouter();
  const { videos, isLoading, isError } = useVideos(); // <- mevcut hook

  if (isLoading) return <Skeleton className="h-28 w-full max-w-xl" />;

  if (isError || !videos?.length) {
    return (
      <div className="text-muted-foreground text-base">
        Henüz video bulunamadı.
      </div>
    );
  }

  const v: Video = videos[0];

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Son Paylaşılan Video</h2>

      <div
        role="button"
        onClick={() => router.push("/videolarim")}
        className="cursor-pointer select-none max-w-xl"
      >
        <div className="pointer-events-none">
          <VideoCard
            id={v.id}
            title={v.title}
            youtubeId={v.youtubeId}
            createdAt={v.createdAt}
            showDelete={false}
          />
        </div>
      </div>
    </div>
  );
}
