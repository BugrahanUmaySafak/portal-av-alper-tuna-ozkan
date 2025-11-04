"use client";

import useSWR from "swr";
import type { Category } from "../types";
import { apiFetch } from "@/lib/api";

// SWR key'i path olsun; fetcher apiFetch çağırır
async function fetchCategories() {
  const data = await apiFetch<{ items: Category[] }>("/api/kategoriler");
  return data.items ?? [];
}

export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR<Category[]>(
    "/api/kategoriler",
    () => fetchCategories(),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: true,
    }
  );

  return {
    categories: data ?? [],
    isLoading,
    isError: Boolean(error),
    error,
    mutate,
  };
}
