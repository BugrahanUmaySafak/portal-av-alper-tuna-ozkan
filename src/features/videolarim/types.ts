import type { Category } from "@/features/kategoriler/types";

export type CategoryRef = Pick<Category, "id" | "name">;

export type Video = {
  id: string;
  title: string;
  youtubeId: string;
  category?: CategoryRef;
  createdAt?: string;
  updatedAt?: string;
  coverUrl?: string;
  coverPublicId?: string;
};

export type VideoList = {
  items: Video[];
};
