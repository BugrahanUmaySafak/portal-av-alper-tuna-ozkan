"use client";

import useSWR from "swr";
import { apiFetch } from "@/lib/api";
import type { Article } from "../types";

type ListResponse = { items: Article[] };

export function useArticles(initialItems?: Article[]) {
  const { data, error, isLoading, mutate } = useSWR<ListResponse>(
    // SWR key relative kalsın; fetcher absolute gider
    `/api/makalelerim`,
    () => apiFetch<ListResponse>(`/api/makalelerim`),
    {
      fallbackData: initialItems ? { items: initialItems } : undefined,
      revalidateOnFocus: false,
    }
  );

  return {
    data: data?.items ?? [],
    isLoading,
    isError: Boolean(error),
    error,
    mutate,
  };
}
