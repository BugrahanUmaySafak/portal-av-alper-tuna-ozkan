// src/features/kategoriler/hooks/useCategories.ts
"use client";

import useSWR from "swr";
import type { Category } from "../types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001";
const CATEGORIES_URL = `${API_BASE}/api/kategoriler`;

const fetcher = (url: string) =>
  fetch(url, { credentials: "include", cache: "no-store" }).then((r) => {
    if (!r.ok) throw new Error("Kategoriler alınamadı");
    return r.json();
  });

export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR<{ items: Category[] }>(
    CATEGORIES_URL,
    fetcher
  );

  return {
    categories: data?.items ?? [],
    isLoading,
    isError: Boolean(error),
    error,
    mutate,
  };
}
