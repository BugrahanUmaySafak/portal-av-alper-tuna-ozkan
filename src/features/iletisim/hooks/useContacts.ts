// src/features/iletisim/hooks/useContacts.ts
"use client";

import useSWR from "swr";
import { apiFetch } from "@/lib/api";

export type Contact = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  title: string;
  content: string;
  createdAt: string;
};

type RawContact = Contact & { _id?: string };
type ListResponse = { items: RawContact[] };

async function fetchContacts(): Promise<Contact[]> {
  const data = await apiFetch<ListResponse>("/api/iletisim");
  const items = data?.items ?? [];
  return items.map((item, idx) => {
    const fallback = `${item.name}-${item.createdAt}-${idx}`;
    return {
      ...item,
      id: item.id ?? item._id ?? fallback,
    };
  });
}

export function useContacts() {
  // Key'i sabit tut; fetcher fonksiyon çağrısız olsun (SWR önerisi)
  const { data, error, isLoading, mutate } = useSWR<Contact[]>(
    "/api/iletisim",
    () => fetchContacts(),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: true,
    }
  );

  return {
    contacts: data ?? [],
    isLoading,
    isError: Boolean(error),
    error,
    mutate,
  };
}
