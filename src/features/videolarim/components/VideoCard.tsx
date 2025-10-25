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
import VideoDelete from "../components/VideoDelete";

type Props = {
  id: string;
  title: string;
  youtubeId: string;
  createdAt: string;
  priority?: boolean;
  showDelete?: boolean;
  onDeleted?: () => void;

  // Cloudinary kapak alanları (sunucudan opsiyonel gelir)
  coverUrl?: string;
  coverBlurDataUrl?: string;
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
  coverBlurDataUrl,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Card className="w-full overflow-hidden rounded-2xl p-0 transition hover:shadow-lg hover:bg-slate-50">
        {/* Thumb alanı */}
        <div className="relative w-full aspect-video rounded-t-2xl overflow-hidden">
          {/* Sil butonu (opsiyonel) */}
          {showDelete && (
            <div className="absolute right-3 top-3 z-10">
              <VideoDelete id={id} onDeleted={onDeleted} />
            </div>
          )}

          {/* Kapak varsa Cloudinary'den; yoksa YouTube lite embed */}
          <div className="absolute inset-0">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={title}
                fill
                className="object-cover rounded-t-2xl"
                placeholder={coverBlurDataUrl ? "blur" : "empty"}
                blurDataURL={coverBlurDataUrl}
                sizes="(max-width:640px) 92vw, (max-width:1024px) 45vw, 420px"
                priority={priority}
              />
            ) : (
              <LiteYouTubeEmbed
                id={youtubeId}
                title={title}
                noCookie
                poster="hqdefault"
                adNetwork={false}
                wrapperClass="yt-lite w-full h-full !m-0 !p-0 rounded-t-2xl"
              />
            )}
          </div>
        </div>

        {/* Kart gövdesi + düzenleme butonu */}
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
                <Link href={`/videolarim/${id}`}>Videoyu düzenle</Link>
              </Button>
            </CardContent>
          </div>
        </DialogTrigger>
      </Card>

      {/* Modal: video oynatıcı + başlık + tarih */}
      <DialogContent className="w-full max-w-sm sm:max-w-2xl md:max-w-3xl p-0 rounded-lg">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="relative w-full aspect-[16/9] rounded-md overflow-hidden">
            {/* Modal içinde gerçek oynatıcıyı açıyoruz (lite) */}
            <div className="absolute inset-0">
              <LiteYouTubeEmbed
                id={youtubeId}
                title={title}
                noCookie
                poster="maxresdefault"
                adNetwork={false}
                wrapperClass="yt-lite w-full h-full !m-0 !p-0"
              />
            </div>
          </div>

          <div className="pt-4 sm:pt-6">
            <DialogTitle className="text-lg md:text-xl font-semibold">
              {title}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-muted-foreground">
              {formatTR(createdAt)}
            </DialogDescription>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
