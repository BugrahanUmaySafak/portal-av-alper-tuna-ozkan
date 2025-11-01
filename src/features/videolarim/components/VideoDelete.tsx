"use client";

import { useState } from "react";
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
  const [loading, setLoading] = useState(false);

  function confirmDelete() {
    toast("Bu videoyu silmek istediğinize emin misiniz?", {
      action: {
        label: "Evet",
        onClick: async () => {
          try {
            setLoading(true);
            await deleteVideo(id);
            toast.success("Video silindi");
            onDeleted?.();
          } catch (e: unknown) {
            const msg =
              e instanceof Error ? e.message : "Silme sırasında hata oluştu";
            toast.error(msg);
          } finally {
            setLoading(false);
          }
        },
      },
      cancel: { label: "Vazgeç", onClick: () => {} },
    });
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      className="h-8"
      disabled={loading}
      onClick={confirmDelete}
      title="Videoyu sil"
    >
      <Trash2 className="w-4 h-4 mr-1" />
      Sil
    </Button>
  );
}
