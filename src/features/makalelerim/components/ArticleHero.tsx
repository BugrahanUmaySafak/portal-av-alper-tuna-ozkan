"use client";

import SmartFigureImage from "@/components/media/SmartFigureImage";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import { uploadArticleImageWithId } from "../actions/uploadArticleImage";

export default function ArticleHero({
  id,
  image,
  title,
  slug,
  onChangeTitleLocal,
  onChangeSlugLocal,
  onUploadedImmediate,
}: {
  id: string;
  image: { url: string; alt: string };
  title: string;
  slug: string;
  onChangeTitleLocal: (v: string) => void;
  onChangeSlugLocal: (v: string) => void;
  onUploadedImmediate: (url: string) => void;
}) {
  async function onPickFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const url = await uploadArticleImageWithId(file, slug, id);
      if (url) onUploadedImmediate(url);
    };
    input.click();
  }

  return (
    <div className="mt-2 sm:mt-4 lg:mt-6">
      <div className="grid gap-3 mb-3">
        <input
          value={slug}
          onChange={(e) => onChangeSlugLocal(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-lg"
          placeholder="slug"
        />
        <input
          value={title}
          onChange={(e) => onChangeTitleLocal(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-xl font-semibold"
          placeholder="Başlık"
        />
      </div>

      <div className="relative">
        <SmartFigureImage
          src={image.url}
          alt={image.alt}
          className="w-full h-[260px] sm:h-[340px] lg:h-[420px] rounded-xl"
          priority
        />
        <div className="absolute right-4 top-4">
          <Button onClick={onPickFile} className="gap-2">
            <ImagePlus className="h-4 w-4" />
            Görseli Değiştir
          </Button>
        </div>
      </div>
    </div>
  );
}
