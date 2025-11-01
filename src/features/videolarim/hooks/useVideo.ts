"use client";

import useSWR from "swr";
import type { Video } from "../types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001";

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

async function fetcher(url: string): Promise<Video> {
  const res = await fetch(url, {
    credentials: "include",
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg =
      (data && data.message) ||
      (typeof data === "string" ? data : "Video bulunamadı");
    throw new Error(msg);
  }

  const v = data as ApiVideo;

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
    id: v.id ?? v._id ?? v.youtubeId,
    title: v.title,
    youtubeId: v.youtubeId,
    createdAt: v.createdAt ?? new Date().toISOString(),
    updatedAt: v.updatedAt ?? undefined,
    coverUrl: v.coverUrl || undefined,
    coverPublicId: v.coverPublicId || undefined,
    category,
  };
}

export function useVideo(id: string | null | undefined) {
  const shouldFetch = Boolean(id);
  const { data, error, isLoading, mutate } = useSWR<Video>(
    shouldFetch ? `${API_BASE}/api/videolarim/${id}` : null,
    fetcher
  );

  return {
    video: data ?? null,
    isLoading: shouldFetch ? isLoading : false,
    isError: Boolean(error),
    error,
    mutate,
  };
}
