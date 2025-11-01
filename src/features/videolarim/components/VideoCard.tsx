// src/features/videolarim/components/VideoCard.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import VideoDelete from "@/features/videolarim/components/VideoDelete";
import type { Video } from "@/features/videolarim/types";

type Props = Video & {
  priority?: boolean;
  showDelete?: boolean;
  onDeleted?: () => void;
};

function formatTR(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function VideoCard({
  id,
  title,
  youtubeId,
  createdAt,
  priority = false,
  showDelete = true,
  onDeleted,
  coverUrl,
  category,
}: Props) {
  const [open, setOpen] = useState(false);

  // 👇 güvenli flag
  const hasYoutubeId = typeof youtubeId === "string" && youtubeId.trim() !== "";
  // 👇 sadece varsa thumbnail üret
  const ytThumb = hasYoutubeId
    ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
    : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Card className="w-full overflow-hidden rounded-2xl p-0 transition hover:shadow-lg hover:bg-slate-50">
        <div className="relative w-full aspect-video rounded-t-2xl overflow-hidden bg-slate-200">
          {showDelete && (
            <div className="absolute right-3 top-3 z-10">
              <VideoDelete id={id} onDeleted={onDeleted} />
            </div>
          )}

          {/* 1. Öncelik: Cloudinary kapak */}
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={title}
              fill
              className="object-cover rounded-t-2xl"
              placeholder="empty"
              sizes="(max-width:640px) 92vw, (max-width:1024px) 45vw, 420px"
              priority={priority}
            />
          ) : hasYoutubeId && ytThumb ? (
            // 2. Öncelik: YouTube thumb (sadece ID varsa!)
            <Image
              src={ytThumb}
              alt={title}
              fill
              className="object-cover rounded-t-2xl"
              placeholder="empty"
              sizes="(max-width:640px) 92vw, (max-width:1024px) 45vw, 420px"
              priority={priority}
            />
          ) : (
            // 3. Fallback: boş state → artık 404 yok 👇
            <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
              YouTube ID girilmedi
            </div>
          )}
        </div>

        <DialogTrigger asChild>
          <div
            className="flex flex-col cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label={`Videoyu aç: ${title}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setOpen(true);
            }}
          >
            <CardHeader className="pt-4 pb-2 px-4">
              <CardTitle className="text-lg sm:text-xl truncate" title={title}>
                {title}
              </CardTitle>
            </CardHeader>

            <CardContent className="px-4 pb-4 space-y-3">
              <p className="text-xs text-muted-foreground">
                {formatTR(createdAt)}
              </p>
              <Button asChild variant="default" size="sm" className="w-full">
                <Link href={`/videolarim/${id}`} prefetch={false}>
                  Videoyu düzenle
                </Link>
              </Button>
            </CardContent>
          </div>
        </DialogTrigger>
      </Card>

      <DialogContent className="w-full max-w-sm sm:max-w-2xl md:max-w-3xl p-0 rounded-lg">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="relative w-full aspect-[16/9] rounded-md overflow-hidden bg-black/70">
            <div className="absolute inset-0">
              {hasYoutubeId ? (
                <LiteYouTubeEmbed
                  id={youtubeId}
                  title={title}
                  noCookie
                  poster="maxresdefault"
                  adNetwork={false}
                  wrapperClass="yt-lite w-full h-full !m-0 !p-0"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/80 text-sm">
                  YouTube ID yok
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 sm:pt-6 space-y-2">
            <DialogTitle className="text-lg md:text-xl font-semibold">
              {title}
            </DialogTitle>

            {category?.name ? (
              <Badge className="text-xs">{category.name}</Badge>
            ) : null}

            <DialogDescription className="mt-1 text-sm text-muted-foreground">
              {formatTR(createdAt)}
            </DialogDescription>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
