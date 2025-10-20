"use client";

import useSWR from "swr";

export type Contact = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  title: string;
  content: string;
  createdAt: string;
};

type RawContact = Contact & { _id?: string }; // ← _id opsiyonel ve tipli
type ListResponse = { items: RawContact[] };

async function fetcher(url: string): Promise<Contact[]> {
  const res = await fetch(url, { credentials: "include", cache: "no-store" });
  if (!res.ok) throw new Error("İletişim verileri alınamadı");

  const data = (await res.json()) as ListResponse;

  // id garanti (id || _id || fallback)
  const normalized: Contact[] = data.items.map((item, idx) => {
    const fallback = `${item.name}-${item.createdAt}-${idx}`;
    return {
      ...item,
      id: item.id ?? item._id ?? fallback,
    };
  });

  return normalized;
}

export function useContacts() {
  const { data, error, isLoading, mutate } = useSWR<Contact[]>(
    "/api/iletisim",
    fetcher
  );

  return {
    contacts: data ?? [],
    isLoading,
    isError: Boolean(error),
    error,
    mutate,
  };
}
