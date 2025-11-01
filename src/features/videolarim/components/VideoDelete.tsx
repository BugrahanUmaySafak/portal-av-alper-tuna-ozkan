// src/features/videolarim/components/VideoDelete.tsx
"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteVideo } from "@/features/videolarim/actions/deleteVideo";

export default function VideoDelete({
  id,
  onDeleted,
}: {
  id: string;
  onDeleted?: () => void;
}) {
  async function handleDelete() {
    if (!confirm("Bu videoyu silmek istediğinize emin misiniz?")) return;

    try {
      await deleteVideo(id);
      toast.success("Video silindi");

      // varsa dışarıdan gelen callback
      onDeleted?.();

      // senin istediğin davranış: tam sayfa yenile
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Silme işlemi başarısız");
    }
  }

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      className="h-8 w-8 p-0 rounded-full shadow-md"
      onClick={handleDelete}
      title="Videoyu sil"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
