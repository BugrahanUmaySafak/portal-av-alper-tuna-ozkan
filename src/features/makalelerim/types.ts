export type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  image: { url: string; alt: string };
  keywords: string[];
  publishedAt: string;
  updatedAt?: string;
  seo?: {
    title: string;
    description: string;
    canonicalUrl: string;
  };
};
