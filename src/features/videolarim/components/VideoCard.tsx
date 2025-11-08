"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import VideoDelete from "@/features/videolarim/components/VideoDelete";
import type { Video } from "@/features/videolarim/types";

type Props = Video & {
  priority?: boolean;
  showDelete?: boolean;
  onDeleted?: () => void;
};

function formatTR(iso?: string) {
  if (!iso) return "Tarih yok";
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
  const categoryLabel = category?.name ?? "—";

  const YT = useMemo(
    () => ({
      maxres: youtubeId
        ? `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`
        : "",
      sd: youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/sddefault.jpg` : "",
      hq: youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : "",
    }),
    [youtubeId]
  );

  // panelde çoğu zaman sadece coverUrl geliyor, blur gelmiyor → coverUrl varsa kapak var diyelim
  const hasRealCover =
    typeof coverUrl === "string" && coverUrl.trim().length > 0;

  const [src, setSrc] = useState<string>(
    hasRealCover ? coverUrl! : YT.maxres || YT.hq
  );
  const [triedMaxres, setTriedMaxres] = useState(false);
  const [triedSd, setTriedSd] = useState(false);

  function handleThumbError() {
    // cloudinary 404 → youtube'a geç
    if (hasRealCover) {
      setSrc(YT.maxres || YT.hq);
      return;
    }

    // youtube maxres 404 → sd
    if (!triedMaxres) {
      setTriedMaxres(true);
      setSrc(YT.sd || YT.hq);
      return;
    }

    // sd de 404 → hq
    if (!triedSd) {
      setTriedSd(true);
      setSrc(YT.hq);
      return;
    }
  }

  const sizes = "(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 420px";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Card className="w-full overflow-hidden rounded-2xl p-0 transition hover:shadow-lg hover:bg-slate-50">
        {/* KAPAK */}
        <div className="relative w-full aspect-video rounded-t-2xl overflow-hidden bg-slate-200">
          {/* sil butonu en üstte, dialog tıklamasından etkilenmesin */}
          {showDelete ? (
            <div className="absolute right-3 top-3 z-20">
              <VideoDelete id={id} onDeleted={onDeleted} />
            </div>
          ) : null}

          {/* asıl görsel */}
          {src ? (
            <Image
              src={src}
              alt={title}
              fill
              className="object-cover"
              onError={handleThumbError}
              priority={priority}
              fetchPriority={priority ? "high" : undefined}
              sizes={sizes}
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-slate-500 text-sm">
              Kapak görseli yok
            </div>
          )}

          {/* üstüne tıklayınca dialog açılsın → bu bir button değilse nested-button olmaz */}
          <DialogTrigger asChild>
            <div
              role="button"
              aria-label={`Videoyu aç: ${title}`}
              tabIndex={0}
              className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/80"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setOpen(true);
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 grid place-items-center pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-red-600/90 text-white grid place-items-center shadow-md">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </DialogTrigger>
        </div>

        {/* METİN / ALT KISIM */}
        <CardHeader className="pt-4 pb-2 px-4 space-y-2">
          <CardTitle className="text-lg sm:text-xl truncate" title={title}>
            {title}
          </CardTitle>
          <Badge variant="category" className="w-fit">
            {categoryLabel}
          </Badge>
        </CardHeader>

        <CardContent className="px-4 pb-4 space-y-3">
          <p className="text-xs text-muted-foreground">{formatTR(createdAt)}</p>
          {/* 👇 ana sitedeki “Videoyu İzlemek İçin Tıklayın” yerine bu */}
          <Button asChild variant="default" size="sm" className="w-full">
            <Link href={`/videolarim/${id}`} prefetch={false}>
              Videoyu düzenle
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* DIALOG → aynen ana sitedeki gibi iframe ile */}
      <DialogContent className="w-full max-w-sm sm:max-w-2xl md:max-w-3xl p-0 rounded-lg">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="relative w-full aspect-[16/9] rounded-md overflow-hidden bg-black">
            {open && youtubeId ? (
              <iframe
                key={youtubeId}
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="eager"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-white/80 text-sm">
                YouTube ID yok
              </div>
            )}
          </div>

          <div className="pt-4 sm:pt-6 space-y-2">
            <DialogTitle className="text-base sm:text-lg md:text-xl font-semibold">
              {title}
            </DialogTitle>
            {category?.name ? (
              <Badge variant="category" className="w-fit">
                {category.name}
              </Badge>
            ) : null}
            <DialogDescription className="text-sm text-muted-foreground">
              {formatTR(createdAt)}
            </DialogDescription>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
