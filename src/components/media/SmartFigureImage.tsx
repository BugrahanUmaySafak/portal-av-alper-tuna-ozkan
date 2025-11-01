// src/components/media/SmartFigureImage.tsx
"use client";

import Image from "next/image";
import clsx from "clsx";

function tinyFromCloudinary(url?: string | null): string | undefined {
  if (!url) return undefined;
  const ok = /res\.cloudinary\.com\/.+\/image\/upload\//.test(url);
  if (!ok) return undefined;
  return url.replace(
    /\/image\/upload\/(?![a-z])/,
    "/image/upload/q_20,w_96,dpr_1,e_blur:300/"
  );
}

type Props = {
  src: string;
  tinySrc?: string;
  alt: string;
  className?: string;
  withBottomGradient?: boolean;
  sizes?: string;
  priority?: boolean;
};

export default function SmartFigureImage({
  src,
  tinySrc,
  alt,
  className,
  withBottomGradient = true,
  priority = false,
  sizes = "(min-width:1024px) 224px, (min-width:768px) 208px, (min-width:640px) 176px, 128px",
}: Props) {
  const derivedTiny = tinySrc || tinyFromCloudinary(src) || src;
  const isBlob = derivedTiny.startsWith?.("blob:");

  return (
    // 🔧 burada artık rounded YOK; radius sadece parent (Card) tarafından verilecek
    <div className={clsx("relative overflow-hidden", className)}>
      {/* Arka plan blur */}
      <Image
        key={`bg:${derivedTiny}`}
        src={derivedTiny}
        alt=""
        aria-hidden
        fill
        sizes={sizes}
        className="absolute inset-0 z-0 object-cover blur-[2px] scale-105 will-change-transform pointer-events-none"
        placeholder={isBlob ? "empty" : undefined}
        decoding="async"
        draggable={false}
        loading={priority ? undefined : "lazy"}
        priority={priority}
      />

      {/* Ön plan */}
      <Image
        key={`fg:${src}`}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="absolute inset-0 z-10 object-contain object-center pointer-events-none"
        placeholder="empty"
        decoding="async"
        draggable={false}
        loading={priority ? undefined : "lazy"}
        priority={priority}
      />

      {withBottomGradient && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 z-20 bg-gradient-to-t from-background/40 to-transparent" />
      )}
    </div>
  );
}
