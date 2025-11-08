// src/features/makalelerim/actions/createArticle.ts
"use client";

import { apiFetch } from "@/lib/api";
import type { ArticleImage } from "../types";

export type CreateArticlePayload = {
  title: string;
  slug: string;
  content: string;
  image: ArticleImage;
  keywords?: string[];
  summary?: string;
  categoryId?: string;
  readingMinutes?: number;
};

export async function createArticle(payload: CreateArticlePayload) {
  return apiFetch(`/api/makalelerim`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
