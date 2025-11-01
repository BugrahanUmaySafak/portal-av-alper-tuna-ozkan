"use client";

import useSWR from "swr";
import type { Article } from "../types";

type ListResponse = { items: Article[] };

const fetcher = (url: string) =>
  fetch(url, { credentials: "include", cache: "no-store" }).then((r) =>
    r.json()
  );

export function useArticles(initialItems?: Article[]) {
  const swr = useSWR<ListResponse>("/api/makalelerim", fetcher, {
    fallbackData: initialItems ? { items: initialItems } : undefined,
  });

  return {
    data: swr.data?.items ?? [],
    isLoading: swr.isLoading,
    isError: Boolean(swr.error),
    error: swr.error,
    mutate: swr.mutate,
  };
}
