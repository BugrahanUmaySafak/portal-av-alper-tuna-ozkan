"use client";

import { apiFetch } from "@/lib/api";
import type { Article } from "../types";

type ArticlePatchWire = Omit<Partial<Article>, "category" | "categoryId"> & {
  categoryId?: string;
};

export async function updateArticle(id: string, patch: Partial<Article>) {
  const body: ArticlePatchWire = {
    ...patch,
    categoryId: patch.categoryId,
  };
  return apiFetch(`/makalelerim/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}
