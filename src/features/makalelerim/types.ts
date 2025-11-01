import type { Category } from "@/features/kategoriler/types";

export type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  image: {
    url: string;
    alt: string;
    tinyUrl?: string;
  };
  summary?: string;

  // API zaten populate ettiği için obje olarak da gelebilir
  category?: Category;

  // ama panel tarafı özellikle formda ID ile çalışıyor
  categoryId?: string;

  keywords: string[];
  publishedAt: string; // ISO
  updatedAt?: string; // ISO
  readingMinutes?: number;
};
