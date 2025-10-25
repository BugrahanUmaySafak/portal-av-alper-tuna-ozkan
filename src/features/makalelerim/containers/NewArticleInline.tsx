"use client";

import Container from "@/components/container/Container";
import Section from "@/components/section/Section";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import ArticleEditor from "../components/ArticleEditor";
import EditableKeywords from "../components/EditableKeywords";
import EditableSEO from "../components/EditableSEO";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ArticleHeroNew from "../components/ArticleHeroNew";
import type { CreateArticlePayload } from "../actions/createArticle";
import { createArticle } from "../actions/createArticle";

export default function NewArticleInline() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  // Görsel seçilene kadar boş zemin
  const [imageUrl] = useState("");

  const [keywords, setKeywords] = useState<string[]>([]);
  const [seo, setSeo] = useState({
    title: "",
    description: "",
    canonicalUrl: "",
  });
  const [file, setFile] = useState<File | undefined>(undefined);

  const isDirty = useMemo(
    () =>
      title.trim() ||
      slug.trim() ||
      content.trim() ||
      imageAlt.trim() ||
      keywords.length > 0 ||
      seo.title.trim() ||
      seo.description.trim() ||
      seo.canonicalUrl.trim(),
    [title, slug, content, imageAlt, keywords, seo]
  );

  async function handleCreate() {
    const ok = window.confirm("Yeni makaleyi oluşturmayı onaylıyor musunuz?");
    if (!ok) return;
    try {
      const payload: CreateArticlePayload = {
        title,
        slug,
        content,
        image: { url: "", alt: imageAlt },
        keywords,
        seo,
      };
      const created = await createArticle(payload, file);
      toast.success("Makale oluşturuldu");
      router.push("/makalelerim");
      return created;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Oluşturulamadı");
    }
  }

  return (
    <>
      <ArticleHeroNew
        image={{ url: imageUrl, alt: imageAlt }}
        title={title}
        slug={slug}
        onChangeTitleLocal={setTitle}
        onChangeSlugLocal={setSlug}
        onChangeAltLocal={setImageAlt}
        onPickFile={(f) => setFile(f)}
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

          <div className="mb-2 text-sm text-muted-foreground">
            İçeriği aşağıdan yazabilir veya yapıştırabilirsiniz. Başlıklar,
            listeler ve bağlantılar desteklenir.
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
