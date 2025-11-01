"use client";

import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useVideos } from "@/features/videolarim/hooks/useVideos";
import type { Video } from "@/features/videolarim/types";
// bu: ana sitedeki dialog’lu kart
import VideoCard from "@/features/videolarim/components/VideoCard";

export default function LatestVideo() {
  const router = useRouter();
  const { videos, isLoading, isError } = useVideos();

  if (isLoading) {
    return <Skeleton className="h-[320px] w-full max-w-[380px]" />;
  }

  if (isError || !videos?.length) {
    return (
      <div className="w-full max-w-[380px] space-y-2">
        <h2 className="text-lg md:text-xl font-semibold">
          Son Paylaşılan Video
        </h2>
        <p className="text-sm text-muted-foreground">Henüz video bulunamadı.</p>
      </div>
    );
  }

  const v: Video = videos[0];

  return (
    <div className="w-full max-w-[380px] space-y-3">
      <h2 className="text-lg md:text-xl font-semibold">Son Paylaşılan Video</h2>

      {/* dışı tıklanabilir, içeriği devre dışı */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => router.push("/videolarim")}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") router.push("/videolarim");
        }}
        className="block w-full cursor-pointer rounded-2xl transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
        aria-label="Videolarım sayfasına git"
      >
        <div className="pointer-events-none">
          <VideoCard
            id={v.id}
            title={v.title}
            youtubeId={v.youtubeId}
            createdAt={v.createdAt}
            coverUrl={v.coverUrl}
            category={v.category}
            // ana sitedeki ilk kart gibi hızlı yüklensin
            priority
          />
        </div>
      </div>
    </div>
  );
}
