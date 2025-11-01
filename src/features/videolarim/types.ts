// src/modules/videos/types.ts

export type VideoCategory = {
  id: string;
  name: string;
};

export type Video = {
  id: string;
  title: string;
  youtubeId: string;
  createdAt: string;
  updatedAt?: string;
  coverUrl?: string;
  coverPublicId?: string;
  category?: VideoCategory;
};
