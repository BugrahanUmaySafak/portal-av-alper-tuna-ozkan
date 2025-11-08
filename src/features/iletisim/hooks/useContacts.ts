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
  createdAt?: string;
};

type ContactList = { items: Contact[] };

async function fetchContacts(): Promise<Contact[]> {
  const data = await apiFetch<ContactList>("/iletisim");
  return data?.items ?? [];
}

export function useContacts() {
  // Key'i sabit tut; fetcher fonksiyon çağrısız olsun (SWR önerisi)
  const { data, error, isLoading, mutate } = useSWR<Contact[]>(
    "/iletisim",
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
