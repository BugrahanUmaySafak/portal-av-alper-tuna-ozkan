"use client";

import Container from "@/components/container/Container";
import Section from "@/components/section/Section";
import { ArrowLeft, CalendarDays, Pencil, Timer } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Article, ArticleImage } from "../types";
import { updateArticle } from "../actions/updateArticle";
import { toast } from "sonner";
import ArticleHero from "../components/ArticleHero";
import ArticleEditor from "../components/ArticleEditor";
import EditableKeywords from "../components/EditableKeywords";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCategories } from "@/features/kategoriler/hooks/useCategories";

function formatTR(iso?: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function ArticleDetailInline({ initial }: { initial: Article }) {
  const router = useRouter();

  const [title, setTitle] = useState(initial.title);
  const [content, setContent] = useState(initial.content);
  const [image, setImage] = useState<ArticleImage>(initial.image);
  const [summary, setSummary] = useState(initial.summary || "");

  // 🔑 sadece id tutuyoruz
  const [categoryId, setCategoryId] = useState(initial.category?.id ?? "");

  const [keywords, setKeywords] = useState<string[]>(initial.keywords ?? []);
  const [readingMinutes, setReadingMinutes] = useState<number | "">(
    typeof initial.readingMinutes === "number" ? initial.readingMinutes : ""
  );

  const { categories } = useCategories();

  const isDirty = useMemo(() => {
    return (
      title !== initial.title ||
      content !== initial.content ||
      image.url !== initial.image.url ||
      image.alt !== initial.image.alt ||
      image.tinyUrl !== initial.image.tinyUrl ||
      image.publicId !== initial.image.publicId ||
      summary !== (initial.summary || "") ||
      // kategori
      categoryId !== (initial.category?.id ?? "") ||
      JSON.stringify(keywords) !== JSON.stringify(initial.keywords ?? []) ||
      (readingMinutes === ""
        ? typeof initial.readingMinutes === "number"
        : readingMinutes !== initial.readingMinutes)
    );
  }, [
    title,
    content,
    image,
    summary,
    categoryId,
    keywords,
    readingMinutes,
    initial,
  ]);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  async function handleSave() {
    const ok = window.confirm("Değişiklikleri onaylıyor musunuz?");
    if (!ok) return;

    try {
      await updateArticle(initial.id, {
        title,
        content,
        image,
        summary,
        // 👇 artık name değil, id gönderiyoruz
        categoryId: categoryId || undefined,
        keywords,
        readingMinutes:
          readingMinutes === "" ? undefined : Number(readingMinutes),
      });
      toast.success("Makale güncellendi");
      router.push("/makalelerim");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Kaydedilemedi");
    }
  }

  return (
    <>
      <ArticleHero
        image={image}
        title={title}
        onChangeTitleLocal={setTitle}
        onChangeAltLocal={(value) =>
          setImage((prev) => ({ ...prev, alt: value }))
        }
        onUploadedImmediate={(uploaded) =>
          setImage((prev) => ({
            ...prev,
            url: uploaded.url,
            tinyUrl: uploaded.tinyUrl ?? prev.tinyUrl,
            publicId: uploaded.publicId,
          }))
        }
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

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-6">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {formatTR(initial.createdAt)}
            </span>
            {initial.updatedAt && (
              <span className="inline-flex items-center gap-1.5">
                <Pencil className="h-4 w-4" />
                Güncellendi: {formatTR(initial.updatedAt)}
              </span>
            )}
            {typeof initial.readingMinutes === "number" && (
              <span className="inline-flex items-center gap-1.5">
                <Timer className="h-4 w-4" />
                {initial.readingMinutes} dk
              </span>
            )}
          </div>

          {/* ÖZET */}
          <div className="mb-4 grid gap-1">
            <label className="text-sm font-medium" htmlFor="summary">
              Özet (SERP açıklaması olarak da kullanılır)
            </label>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              placeholder="120 - 155 karakter arası, içeriğin özünü anlatan kısa bir özet."
              className="w-full rounded-md border px-3 py-2"
            />
            <div className="text-xs text-muted-foreground">
              {summary.length} karakter
            </div>
          </div>

          {/* KATEGORİ */}
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

          {/* OKUMA SÜRESİ */}
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

          {/* İÇERİK */}
          <div className="mb-2 text-sm text-muted-foreground">
            İçeriği aşağıdan düzenleyebilirsiniz. (Editörde H1 yok; H2/H3
            kullanın.)
          </div>
          <ArticleEditor value={content} onChange={setContent} />

          {/* KEYWORDS */}
          <div className="mt-6">
            <EditableKeywords keywords={keywords} onChange={setKeywords} />
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={!isDirty}
              className="h-10 px-6"
            >
              Güncelle
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
