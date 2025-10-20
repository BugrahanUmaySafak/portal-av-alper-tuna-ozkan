// src/features/videolarim/hooks/useVideo.ts
"use client";

import useSWR from "swr";
import type { Video } from "@/features/videolarim/types";
import { getVideoById } from "../actions/getVideoById";

export function useVideo(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Video>(
    id ? [`/api/videolarim/${id}`, id] : null,
    () => getVideoById(id)
  );

  return {
    video: data ?? null,
    isLoading,
    isError: Boolean(error),
    error,
    mutate,
  };
}
