// src/features/makalelerim/components/ArticleHero.tsx
"use client";

import Container from "@/components/container/Container";
import SmartFigureImage from "@/components/media/SmartFigureImage";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { uploadArticleImage } from "../actions/uploadArticleImage";
import type { UploadedImage } from "../actions/uploadArticleImage";
import type { ArticleImage } from "../types";

export default function ArticleHero({
  image,
  title,
  onChangeTitleLocal,
  onChangeAltLocal,
  onUploadedImmediate,
}: {
  image: ArticleImage;
  title: string;
  onChangeTitleLocal: (v: string) => void;
  onChangeAltLocal: (v: string) => void;
  onUploadedImmediate: (v: UploadedImage) => void;
}) {
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setLocalPreview(preview);
    setIsUploading(true);
    setProgress(0);

    try {
      const uploaded = await uploadArticleImage(file, {
        onProgress: setProgress,
      });
      onUploadedImmediate(uploaded);
      setLocalPreview(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Görsel yüklenemedi";
      toast.error(message);
      setLocalPreview(null);
    } finally {
      if (fileRef.current) fileRef.current.value = "";
      setIsUploading(false);
      setProgress(null);
      setTimeout(() => URL.revokeObjectURL(preview), 5000);
    }
  }

  const displayUrl = localPreview ?? image.url;
  const displayTiny = localPreview ? localPreview : image.tinyUrl ?? image.url;

  return (
    <div className="mt-2 sm:mt-4 lg:mt-6">
      <Container className="grid gap-2 mb-3">
        <label className="grid gap-1">
          <span className="text-sm font-medium">Başlık (H1)</span>
          <input
            value={title}
            onChange={(e) => onChangeTitleLocal(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-xl font-semibold"
            placeholder="örn: Emlak Hukuku Rehberi 2025"
            aria-describedby="title-help"
          />
          <span id="title-help" className="text-xs text-muted-foreground">
            Sayfada <strong>H1</strong> başlık olarak kullanılacaktır.
          </span>
        </label>
      </Container>

      <div className="relative">
        <SmartFigureImage
          src={displayUrl}
          tinySrc={displayTiny}
          alt={image.alt}
          className="w-full h-[260px] sm:h-[340px] lg:h-[420px] rounded-xl"
          priority
        />

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="absolute right-4 top-4 z-30">
          <Button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="gap-2"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {progress !== null ? `%${progress}` : "Yükleniyor"}
              </>
            ) : (
              <>
                <ImagePlus className="h-4 w-4" /> Görseli Değiştir
              </>
            )}
          </Button>
        </div>
      </div>

      <Container className="mt-3">
        <label className="grid gap-1">
          <span className="text-sm font-medium">Görsel Alt Metni</span>
          <input
            value={image.alt}
            onChange={(e) => onChangeAltLocal(e.target.value)}
            placeholder="örn: Adliye binası önünde duran avukat"
            className="w-full rounded-md border px-3 py-2"
            aria-describedby="alt-help"
          />
          <span id="alt-help" className="text-xs text-muted-foreground">
            Erişilebilirlik ve SEO için anlamlı bir alt metin yazın.
          </span>
        </label>
      </Container>
    </div>
  );
}
