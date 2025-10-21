"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteArticle } from "../actions/deleteArticle";

export default function ArticleDelete({
  id,
  onDeleted,
}: {
  id: string;
  onDeleted?: () => void;
}) {
  function confirmDelete() {
    toast("Bu makaleyi silmek istediğinize emin misiniz?", {
      description: "Bu işlem geri alınamaz.",
      action: {
        label: "Sil",
        onClick: async () => {
          try {
            await deleteArticle(id);
            toast.success("Makale silindi");
            onDeleted?.();
          } catch (e) {
            toast.error(e instanceof Error ? e.message : "Silme hatası");
          }
        },
      },
      cancel: { label: "Vazgeç", onClick: () => {} },
    });
  }

  return (
    <Button
      variant="destructive"
      size="icon"
      className="h-8 w-8 rounded-full shadow-md"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        confirmDelete();
      }}
      aria-label="Makaleyi sil"
      title="Makaleyi sil"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
