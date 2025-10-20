"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import VideoCard from "@/features/videolarim/components/VideoCard";
import { createVideo } from "../actions/createVideo";

const youtubeIdRegex = /^[a-zA-Z0-9_-]{6,}$/;

const schema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalıdır"),
  youtubeId: z.string().regex(youtubeIdRegex, "Geçerli bir YouTube ID giriniz"),
});

type FormValues = z.infer<typeof schema>;

export default function NewVideoForm() {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      youtubeId: "",
    },
    mode: "onChange",
  });

  const values = form.watch();

  const preview = useMemo(
    () => ({
      id: "preview",
      title: values.title || "Video Başlığı",
      youtubeId: values.youtubeId || "",
      createdAt: new Date().toISOString(),
    }),
    [values.title, values.youtubeId]
  );

  async function onSubmit(data: FormValues) {
    try {
      await createVideo(data);
      toast.success("Video oluşturuldu");
      router.replace("/videolarim");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Video oluşturulamadı");
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 items-start">
      {/* Sol: Form */}
      <Card className="w-full max-w-lg rounded-2xl border border-border/60 shadow-sm overflow-hidden">
        <CardHeader className="px-5 py-4 border-b">
          <CardTitle className="text-base sm:text-lg">
            Yeni Video Ekle
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
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Sadece ID girin (tam URL değil). Örnek URL:{" "}
                <code>https://youtube.com/watch?v=</code>
                <b>uelHwf8o7_U</b>
              </p>
            </div>

            <div className="pt-1 flex items-center gap-3">
              <Button
                type="submit"
                className="h-11 text-base"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
              >
                {form.formState.isSubmitting ? "Kaydediliyor..." : "Kaydet"}
              </Button>

              <Button
                type="button"
                variant="secondary"
                className="h-11 text-base"
                onClick={() => router.push("/videolarim")}
              >
                Vazgeç
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Sağ: Preview */}
      <div>
        <VideoCard
          id={preview.id}
          title={preview.title}
          youtubeId={preview.youtubeId}
          createdAt={preview.createdAt}
          showDelete={false}
        />
      </div>
    </div>
  );
}
