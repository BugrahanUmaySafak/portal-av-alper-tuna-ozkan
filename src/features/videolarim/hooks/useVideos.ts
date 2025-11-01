"use client";

import useSWR from "swr";
import type { Video } from "../types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001";
const VIDEOS_URL = `${API_BASE}/api/videolarim`;

// API bize iki şekilde dönebiliyor:
// 1) { items: [...] }
// 2) [ ... ]
type ApiVideo = {
  id?: string;
  _id?: string;
  title: string;
  youtubeId: string;
  createdAt?: string;
  updatedAt?: string;
  coverUrl?: string;
  coverPublicId?: string;
  category?:
    | { id?: string; _id?: string; name: string }
    | string
    | null
    | undefined;
};

type ApiResponse = ApiVideo[] | { items: ApiVideo[] };

type ErrorLike = {
  message?: string;
};

function hasMessage(obj: unknown): obj is ErrorLike {
  return typeof obj === "object" && obj !== null && "message" in obj;
}

function hasItems(obj: unknown): obj is { items: ApiVideo[] } {
  return typeof obj === "object" && obj !== null && "items" in obj;
}

async function fetcher(url: string): Promise<Video[]> {
  const res = await fetch(url, {
    credentials: "include",
    cache: "no-store",
  });

  // bir kere json oku
  const json = (await res.json().catch(() => null)) as
    | ApiResponse
    | ErrorLike
    | string
    | null;

  // hata durumu
  if (!res.ok || json === null) {
    const msg =
      (json && hasMessage(json) && json.message) ||
      (typeof json === "string" ? json : "Videolar alınamadı");
    throw new Error(msg);
  }

  // başarı durumu
  const rawItems: ApiVideo[] = Array.isArray(json)
    ? json
    : hasItems(json)
    ? json.items ?? []
    : [];

  return rawItems.map((v, idx): Video => {
    // kategori normalize
    let category: Video["category"] = undefined;
    if (v.category) {
      if (typeof v.category === "object" && v.category._id) {
        category = { id: String(v.category._id), name: v.category.name };
      } else if (typeof v.category === "object" && v.category.id) {
        category = { id: String(v.category.id), name: v.category.name };
      } else if (typeof v.category === "string") {
        category = { id: "", name: v.category };
      }
    }

    return {
      id: v.id ?? v._id ?? `${v.youtubeId}-${idx}`,
      title: v.title,
      youtubeId: v.youtubeId,
      createdAt: v.createdAt ?? new Date().toISOString(),
      updatedAt: v.updatedAt ?? undefined,
      coverUrl: v.coverUrl || undefined,
      coverPublicId: v.coverPublicId || undefined,
      category,
    };
  });
}

export function useVideos() {
  const { data, error, isLoading, mutate } = useSWR<Video[]>(
    // relative de kullanabilirdin ama biz burada env’li tam URL kullanıyoruz
    VIDEOS_URL,
    fetcher
  );

  return {
    videos: data ?? [],
    isLoading,
    isError: Boolean(error),
    error,
    mutate,
  };
}
