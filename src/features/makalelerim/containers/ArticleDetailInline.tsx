"use client";

import Container from "@/components/container/Container";
import Section from "@/components/section/Section";
import { ArrowLeft, CalendarDays, Pencil } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Article } from "../types";
import { updateArticle } from "../actions/updateArticle";
import { toast } from "sonner";
import ArticleHero from "../components/ArticleHero";
import ArticleEditor from "../components/ArticleEditor";
import EditableKeywords from "../components/EditableKeywords";
import EditableSEO from "../components/EditableSEO";
import { Button } from "@/components/ui/button";

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
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [content, setContent] = useState(initial.content);
  const [imageUrl, setImageUrl] = useState(initial.image.url);
  const [imageAlt] = useState(initial.image.alt);
  const [keywords, setKeywords] = useState<string[]>(initial.keywords ?? []);
  const [seo, setSeo] = useState(
    initial.seo ?? { title: "", description: "", canonicalUrl: "" }
  );

  const published = formatTR(initial.publishedAt);
  const updatedAt = formatTR(initial.updatedAt);

  const isDirty = useMemo(() => {
    return (
      title !== initial.title ||
      slug !== initial.slug ||
      content !== initial.content ||
      imageUrl !== initial.image.url ||
      JSON.stringify(keywords) !== JSON.stringify(initial.keywords ?? []) ||
      JSON.stringify(seo) !==
        JSON.stringify(
          initial.seo ?? { title: "", description: "", canonicalUrl: "" }
        )
    );
  }, [title, slug, content, imageUrl, keywords, seo, initial]);

  async function handleSave() {
    try {
      const patch: Partial<Article> = {
        title,
        slug,
        content,
        image: { url: imageUrl, alt: imageAlt },
        keywords,
        seo,
      };
      const updated = await updateArticle(initial.id, patch);
      setTitle(updated.title);
      setSlug(updated.slug);
      setContent(updated.content);
      setImageUrl(updated.image.url);
      setKeywords(updated.keywords ?? []);
      setSeo(updated.seo ?? { title: "", description: "", canonicalUrl: "" });
      toast.success("Makale güncellendi");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Kaydedilemedi");
    }
  }

  return (
    <>
      <ArticleHero
        id={initial.id}
        image={{ url: imageUrl, alt: imageAlt }}
        title={title}
        slug={slug}
        onChangeTitleLocal={setTitle}
        onChangeSlugLocal={setSlug}
        onUploadedImmediate={(url) => setImageUrl(url)}
      />

      <Section>
        <Container>
          <div className="mb-4">
            <Link
              href="/makalelerim"
              className="inline-flex items-center gap-2 text-sm rounded-md border px-3 py-1.5 hover:bg-accent transition"
              aria-label="Tüm yazılara geri dön"
            >
              <ArrowLeft className="h-4 w-4" />
              Tüm yazılara geri dön
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-6">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {published}
            </span>
            {updatedAt && (
              <span className="inline-flex items-center gap-1.5">
                <Pencil className="h-4 w-4" />
                Güncellendi: {updatedAt}
              </span>
            )}
          </div>

          <ArticleEditor value={content} onChange={setContent} />

          <div className="mt-6">
            <EditableKeywords keywords={keywords} onChange={setKeywords} />
          </div>

          <div className="mt-8">
            <EditableSEO seo={seo} onChange={setSeo} />
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
