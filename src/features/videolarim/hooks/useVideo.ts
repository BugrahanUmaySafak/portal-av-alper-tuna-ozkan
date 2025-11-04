"use client";

import useSWR from "swr";
import type { Video } from "../types";
import { apiFetch } from "@/lib/api";

async function fetchOne(id: string) {
  return apiFetch<Video>(`/api/videolarim/${id}`);
}

export function useVideo(id: string | null | undefined) {
  const should = Boolean(id);
  const { data, error, isLoading, mutate } = useSWR<Video>(
    should ? `/api/videolarim/${id}` : null,
    () => fetchOne(id as string),
    { revalidateOnFocus: false }
  );

  return {
    video: data ?? null,
    isLoading: should ? isLoading : false,
    isError: Boolean(error),
    error,
    mutate,
  };
}
