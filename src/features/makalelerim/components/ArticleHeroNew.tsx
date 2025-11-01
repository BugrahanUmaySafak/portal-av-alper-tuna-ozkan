"use client";

import SmartFigureImage from "@/components/media/SmartFigureImage";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import { useState } from "react";
import Container from "@/components/container/Container";

export default function ArticleHeroNew({
  image,
  title,
  onChangeTitleLocal,
  onChangeAltLocal,
  onPickFile,
}: {
  image: { url?: string; alt: string };
  title: string;
  onChangeTitleLocal: (v: string) => void;
  onChangeAltLocal: (v: string) => void;
  onPickFile: (file: File) => void;
}) {
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  async function handlePick() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const preview = URL.createObjectURL(file);
      setLocalPreview(preview);
      onPickFile(file);
      setTimeout(() => URL.revokeObjectURL(preview), 5000);
    };
    input.click();
  }

  const displayUrl = localPreview ?? image.url ?? null;

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
        {displayUrl ? (
          <SmartFigureImage
            src={displayUrl}
            tinySrc={displayUrl}
            alt={image.alt}
            className="w-full h-[260px] sm:h-[340px] lg:h-[420px] rounded-xl"
            priority
          />
        ) : (
          <div className="w-full h-[260px] sm:h-[340px] lg:h-[420px] rounded-xl bg-muted flex items-center justify-center">
            <span className="text-sm text-muted-foreground">
              Görsel seçilmemiş
            </span>
          </div>
        )}
        <div className="absolute right-4 top-4">
          <Button onClick={handlePick} className="gap-2">
            <ImagePlus className="h-4 w-4" /> Görseli Seç
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
