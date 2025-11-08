"use client";

import useSWR from "swr";
import type { Category, CategoryList } from "../types";
import { apiFetch } from "@/lib/api";

// SWR key'i path olsun; fetcher apiFetch çağırır
async function fetchCategories() {
  const data = await apiFetch<CategoryList>("/kategoriler");
  return data.items ?? [];
}

export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR<Category[]>(
    "/kategoriler",
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
