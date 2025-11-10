"use client";

import Container from "@/components/container/Container";
import Section from "@/components/section/Section";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import ArticleEditor from "../components/ArticleEditor";
import EditableKeywords from "../components/EditableKeywords";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ArticleHeroNew from "../components/ArticleHeroNew";
import type { CreateArticlePayload } from "../actions/createArticle";
import { createArticle } from "../actions/createArticle";
import { useEffect, useMemo, useState } from "react";
import { useCategories } from "@/features/kategoriler/hooks/useCategories";
import type { UploadedImage } from "../actions/uploadArticleImage";

export default function NewArticleInline() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [summary, setSummary] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [readingMinutes, setReadingMinutes] = useState<number | "">("");
  const [imageData, setImageData] = useState<UploadedImage | null>(null);

  const { categories } = useCategories();

  const isDirty = useMemo(
    () =>
      title.trim() ||
      content.trim() ||
      imageAlt.trim() ||
      summary.trim() ||
      categoryId.trim() ||
      keywords.length > 0 ||
      readingMinutes !== "",
    [title, content, imageAlt, summary, categoryId, keywords, readingMinutes]
  );

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  async function handleCreate() {
    const ok = window.confirm("Yeni makaleyi oluşturmayı onaylıyor musunuz?");
    if (!ok) return;

    if (!title.trim()) {
      toast.error("Makale başlığı gereklidir.");
      return;
    }
    if (!imageData) {
      toast.error("Kapak görselini yüklemelisiniz.");
      return;
    }

    try {
      const payload: CreateArticlePayload = {
        title: title.trim(),
        content,
        image: {
          url: imageData.url,
          tinyUrl: imageData.tinyUrl,
          publicId: imageData.publicId,
          alt: imageAlt,
        },
        keywords,
        summary,
        categoryId: categoryId || undefined,
        readingMinutes:
          readingMinutes === "" ? undefined : Number(readingMinutes),
      };

      await createArticle(payload);
      toast.success("Makale oluşturuldu");
      router.push("/makalelerim");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Oluşturulamadı");
    }
  }

  return (
    <>
      <ArticleHeroNew
        image={{
          url: imageData?.url,
          tinyUrl: imageData?.tinyUrl,
          alt: imageAlt,
        }}
        title={title}
        onChangeTitleLocal={setTitle}
        onChangeAltLocal={setImageAlt}
        onImageUploaded={(img) => setImageData(img)}
      />

      <Section>
        <Container>
          <div className="mb-4">
            <Link
              href="/makalelerim"
              className="inline-flex items-center gap-2 text-sm rounded-md border px-3 py-1.5 hover:bg-accent transition"
              aria-label="Tüm yazılara geri dön"
            >
              <ArrowLeft className="h-4 w-4" /> Tüm yazılara geri dön
            </Link>
          </div>

          <div className="mb-4 grid gap-1">
            <label className="text-sm font-medium" htmlFor="summary">
              Özet (SERP açıklaması)
            </label>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              placeholder="120 - 155 karakter"
              className="w-full rounded-md border px-3 py-2"
            />
            <div className="text-xs text-muted-foreground">
              {summary.length} karakter
            </div>
          </div>

          <div className="mb-6 grid gap-2">
            <label className="text-sm font-medium">Kategori</label>
            <select
              className="min-w-56 rounded-md border px-3 py-2"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">— Kategori seçin —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6 grid gap-1 max-w-xs">
            <label className="text-sm font-medium" htmlFor="readingMinutes">
              Okuma Süresi (dakika)
            </label>
            <input
              id="readingMinutes"
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              value={readingMinutes}
              onChange={(e) => {
                const v = e.target.value;
                setReadingMinutes(v === "" ? "" : Math.max(1, Number(v)));
              }}
              placeholder="örn: 4"
              className="rounded-md border px-3 py-2"
            />
            <p className="text-xs text-muted-foreground">
              Opsiyonel; sayı olarak dakikayı girin (örn: 4).
            </p>
          </div>

          <div className="mb-2 text-sm text-muted-foreground">
            İçeriği aşağıdan yazabilir veya yapıştırabilirsiniz. (Editörde H1
            yok.)
          </div>
          <ArticleEditor value={content} onChange={setContent} />

          <div className="mt-6">
            <EditableKeywords keywords={keywords} onChange={setKeywords} />
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleCreate}
              disabled={!isDirty}
              className="h-10 px-6"
            >
              Kaydet
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
