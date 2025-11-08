import type { Category } from "@/features/kategoriler/types";

export type ArticleImage = {
  url: string;
  alt: string;
  publicId: string;
  tinyUrl?: string;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  image: ArticleImage;
  summary?: string;

  // API zaten populate ettiği için obje olarak da gelebilir
  category?: Category;

  // ama panel tarafı özellikle formda ID ile çalışıyor
  categoryId?: string;

  keywords: string[];
  createdAt: string; // ISO
  updatedAt?: string; // ISO
  readingMinutes?: number;
};
