// src/features/videolarim/types.ts (panel projesi)
export type Video = {
  id: string;
  title: string;
  youtubeId: string;
  createdAt: string;
  updatedAt?: string;
  coverUrl?: string; // 👈 Cloudinary'den
  coverBlurDataUrl?: string; // 👈 base64 blur
};
