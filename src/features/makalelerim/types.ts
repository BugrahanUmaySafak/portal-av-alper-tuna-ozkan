import type { Category } from "@/features/kategoriler/types";

export type CategoryRef = Pick<Category, "id" | "name">;

export type ArticleImage = {
  url: string;
  alt: string;
  tinyUrl?: string;
  publicId?: string;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  image: ArticleImage;
  summary?: string;

  category?: CategoryRef;
  categoryId?: string;

  keywords: string[];
  createdAt: string; // ISO
  updatedAt?: string; // ISO
  readingMinutes?: number;
};

export type ArticleList = {
  items: Article[];
};
