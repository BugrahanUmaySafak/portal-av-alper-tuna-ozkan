"use client";

import useSWR from "swr";
import type { Video } from "../types";

type RawVideo = Video & { _id?: string };
type ListResponse = { items: RawVideo[] };

async function fetcher(url: string): Promise<Video[]> {
  const res = await fetch(url, { credentials: "include", cache: "no-store" });
  if (!res.ok) throw new Error("Videolar alınamadı");

  const data = (await res.json()) as ListResponse;

  // id garanti (id || _id || fallback)
  const normalized: Video[] = data.items.map((v, idx) => ({
    ...v,
    id: v.id ?? v._id ?? `${v.youtubeId}-${v.createdAt}-${idx}`,
  }));

  return normalized;
}

export function useVideos() {
  const { data, error, isLoading, mutate } = useSWR<Video[]>(
    "/api/videolarim",
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
