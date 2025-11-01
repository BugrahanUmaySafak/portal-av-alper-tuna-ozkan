// src/features/videolarim/components/VideoEdit.tsx
"use client";

import { useMemo } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import VideoCard from "@/features/videolarim/components/VideoCard";
import type { Video } from "@/features/videolarim/types";
import { updateVideo } from "@/features/videolarim/actions/updateVideo";
import { useCategories } from "@/features/kategoriler/hooks/useCategories";

const youtubeIdRegex = /^[a-zA-Z0-9_-]{6,}$/;

const schema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalıdır"),
  youtubeId: z.string().regex(youtubeIdRegex, "Geçerli bir YouTube ID giriniz"),
  categoryId: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function VideoEdit({
  initial,
  onUpdated,
}: {
  initial: Video;
  onUpdated?: () => void;
}) {
  const { categories } = useCategories();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial.title,
      youtubeId: initial.youtubeId,
      categoryId: initial.category?.id ?? "",
    },
    mode: "onChange",
  });

  const values = form.watch();

  const preview = useMemo(() => {
    const selectedCat = categories.find((c) => c.id === values.categoryId);
    return {
      id: initial.id,
      title: values.title,
      youtubeId: values.youtubeId,
      createdAt: initial.createdAt,
      coverUrl: initial.coverUrl,
      coverPublicId: initial.coverPublicId,
      category: selectedCat
        ? { id: selectedCat.id, name: selectedCat.name }
        : initial.category,
    } satisfies Video;
  }, [
    initial.id,
    initial.createdAt,
    initial.coverUrl,
    initial.coverPublicId,
    initial.category,
    values.title,
    values.youtubeId,
    values.categoryId,
    categories,
  ]);

  async function onSubmit(data: FormValues) {
    try {
      await updateVideo(initial.id, {
        title: data.title,
        youtubeId: data.youtubeId,
        categoryId: data.categoryId || undefined,
      });
      toast.success("Video güncellendi");
      onUpdated?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Bir hata oluştu");
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 items-start">
      {/* Sol: Preview */}
      <div>
        <VideoCard
          id={preview.id}
          title={preview.title}
          youtubeId={preview.youtubeId}
          createdAt={preview.createdAt}
          showDelete={false}
          coverUrl={preview.coverUrl}
          category={preview.category}
        />
      </div>

      {/* Sağ: Form */}
      <Card className="w-full max-w-lg rounded-2xl border border-border/60 shadow-sm overflow-hidden">
        <CardHeader className="px-5 py-4 border-b">
          <CardTitle className="text-base sm:text-lg">
            Videoyu düzenle
          </CardTitle>
        </CardHeader>

        <CardContent className="px-5 py-4">
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Başlık
              </Label>
              <Input
                id="title"
                {...form.register("title")}
                placeholder="Örn: Tenkis Davası Kısa Rehber"
                className="h-11 text-base"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="youtubeId" className="text-sm font-medium">
                YouTube ID
              </Label>
              <Input
                id="youtubeId"
                {...form.register("youtubeId")}
                placeholder="Örn: uelHwf8o7_U"
                className="h-11 text-base"
              />
              {form.formState.errors.youtubeId && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.youtubeId.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="categoryId" className="text-sm font-medium">
                Kategori
              </Label>
              <select
                id="categoryId"
                className="h-10 rounded-md border px-3 py-2 bg-background"
                {...form.register("categoryId")}
              >
                <option value="">— Kategori seçin —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-1">
              <Button
                type="submit"
                className="w-full h-11 text-base"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
              >
                {form.formState.isSubmitting ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
