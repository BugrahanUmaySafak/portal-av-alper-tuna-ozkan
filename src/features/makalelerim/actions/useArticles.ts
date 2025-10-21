"use client";

import useSWR from "swr";
import type { Article } from "../types";

type ListResponse = { items: Article[] };

const fetcher = (url: string) =>
  fetch(url, { credentials: "include", cache: "no-store" }).then((r) =>
    r.json()
  );

export function useArticles(initialItems?: Article[]) {
  const { data, error, isLoading, mutate } = useSWR<ListResponse>(
    "/api/makalelerim",
    fetcher,
    { fallbackData: initialItems ? { items: initialItems } : undefined }
  );

  return {
    articles: data?.items ?? [],
    isLoading,
    isError: Boolean(error),
    error,
    mutate,
  };
}
