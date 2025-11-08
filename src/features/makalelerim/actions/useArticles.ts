"use client";

import useSWR from "swr";
import { apiFetch } from "@/lib/api";
import type { Article, ArticleList } from "../types";

export function useArticles(initialItems?: Article[]) {
  const { data, error, isLoading, mutate } = useSWR<ArticleList>(
    // SWR key relative kalsın; fetcher absolute gider
    `/makalelerim`,
    () => apiFetch<ArticleList>(`/makalelerim`),
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
