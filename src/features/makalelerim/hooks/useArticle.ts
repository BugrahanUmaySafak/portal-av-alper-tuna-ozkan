"use client";

import useSWR from "swr";
import type { Article } from "../types";

const fetcher = (url: string) =>
  fetch(url, { credentials: "include", cache: "no-store" }).then((r) =>
    r.json()
  );

export function useArticle(slug: string, initial?: Article | null) {
  const { data, error, isLoading, mutate } = useSWR<Article>(
    slug ? `/api/makalelerim/${slug}` : null,
    fetcher,
    { fallbackData: initial ?? undefined }
  );
  return { data, error, isLoading, mutate };
}
