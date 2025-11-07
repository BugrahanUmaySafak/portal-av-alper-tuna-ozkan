"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createArticle } from "@/features/makalelerim/actions/createArticle";
import { useCategories } from "@/features/kategoriler/hooks/useCategories";
import { uploadArticleImageWithId } from "../actions/uploadArticleImage";

/* Basit slugify (Türkçe karakterleri düzelt) */
function slugify(input: string) {
  return input
    .toLowerCase()
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ı", "i")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewArticleInline() {
  const router = useRouter();
  const { categories } = useCategories();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [keywords, setKeywords] = useState<string>("");
  const [readingMinutes, setReadingMinutes] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [imageAlt, setImageAlt] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [isPending, startTransition] = useTransition();

  const computedSlug = useMemo(
    () => (slug.trim() ? slugify(slug) : slugify(title)),
    [slug, title]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      title: title.trim(),
      slug: computedSlug,
      content,
      image: { alt: imageAlt.trim() },
      keywords: keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
      summary: summary.trim() || undefined,
      categoryId: categoryId || undefined,
      readingMinutes:
        typeof readingMinutes === "number" ? readingMinutes : undefined,
    };

    if (!payload.title || !payload.slug) {
      toast.error("Başlık ve slug zorunludur.");
      return;
    }

    startTransition(async () => {
      try {
        // 1) Makale kaydı (JSON)
        const created = await createArticle(payload); // { id, ... }

        // 2) Görsel varsa, API'ye direkt PATCH (Vercel limiti yok)
        if (file) {
          await uploadArticleImageWithId(
            file,
            payload.slug,
            String(created.id)
          );
        }

        toast.success("Makale oluşturuldu");
        router.replace("/makalelerim");
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Makale oluşturulamadı";
        toast.error(msg);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-2">
        <label className="text-sm font-medium">Başlık *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded p-2"
          placeholder="Makale başlığı"
          required
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">
          Slug (boş bırakırsan başlıktan türetir)
        </label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="border rounded p-2"
          placeholder="ornek-makale"
        />
        <p className="text-xs text-gray-500">
          Kullanılacak slug: <b>{computedSlug || "(boş)"}</b>
        </p>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Özet</label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="border rounded p-2 min-h-24"
          placeholder="Kısa özet"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Kategori</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="border rounded p-2"
          >
            <option value="">(Seçim yok)</option>
            {categories.map((c) => (
              <option key={c.id ?? c.id ?? c.name} value={c.id ?? c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Okuma süresi (dk)</label>
          <input
            type="number"
            min={1}
            value={readingMinutes}
            onChange={(e) =>
              setReadingMinutes(e.target.value ? Number(e.target.value) : "")
            }
            className="border rounded p-2"
            placeholder="Örn: 5"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">
          Anahtar kelimeler (virgülle ayır)
        </label>
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="border rounded p-2"
          placeholder="ör: hukuk, dava, danışmanlık"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">İçerik *</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border rounded p-2 min-h-40"
          placeholder="Makale içerği"
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Kapak görseli</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="border rounded p-2"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Görsel alt metni</label>
          <input
            type="text"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            className="border rounded p-2"
            placeholder="Görsel açıklaması (SEO)"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
        >
          {isPending ? "Kaydediliyor..." : "Kaydet"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 rounded border"
        >
          İptal
        </button>
      </div>
    </form>
  );
}
