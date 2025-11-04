"use client";

import useSWR from "swr";
import type { Video } from "../types";
import { apiFetch } from "@/lib/api";

async function fetchMany() {
  // API {items:[...]} döndürüyor
  const res = await apiFetch<{ items: Video[] }>(`/api/videolarim`);
  return res.items ?? [];
}

export function useVideos() {
  const { data, error, isLoading, mutate } = useSWR<Video[]>(
    `/api/videolarim`,
    () => fetchMany(),
    { revalidateOnFocus: false }
  );

  return {
    videos: data ?? [],
    isLoading,
    isError: Boolean(error),
    error,
    mutate,
  };
}
