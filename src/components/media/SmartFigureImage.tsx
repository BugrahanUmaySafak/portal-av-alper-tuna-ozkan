"use client";

import Image from "next/image";
import clsx from "clsx";

function cld(url: string, params: string) {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("res.cloudinary.com")) return url;
    const [prefix, rest] = u.pathname.split("/image/upload/");
    if (!rest) return url;
    return `${u.origin}${prefix}/image/upload/${params}/${rest}`;
  } catch {
    return url;
  }
}

type Props = {
  src: string;
  alt: string;
  className?: string;
  withBottomGradient?: boolean;
  sizes?: string;
  priority?: boolean;
};

export default function SmartFigureImage({
  src,
  alt,
  className,
  withBottomGradient = true,
  priority = false,
  sizes = `(min-width: 1024px) calc(100vw - 8rem),
           (min-width: 640px) calc(100vw - 3rem),
           calc(100vw - 2rem)`,
}: Props) {
  const bg = cld(src, "f_auto,q_auto,c_fill,g_auto,w_1600,ar_16:9,e_blur:800");
  const fg = cld(src, "f_auto,q_auto,c_fit,g_auto,w_1600");

  return (
    <div className={clsx("relative overflow-hidden rounded-xl", className)}>
      <Image
        src={bg}
        alt=""
        aria-hidden
        fill
        sizes={sizes}
        className="object-cover scale-105 will-change-transform"
        decoding="async"
        draggable={false}
        priority={priority}
      />
      <Image
        src={fg}
        alt={alt}
        fill
        sizes={sizes}
        className="object-contain object-center"
        decoding="async"
        draggable={false}
        priority={priority}
      />
      {withBottomGradient && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background/40 to-transparent" />
      )}
    </div>
  );
}
