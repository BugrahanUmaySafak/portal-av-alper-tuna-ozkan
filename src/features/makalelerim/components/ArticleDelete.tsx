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
  async function handleDelete(e: React.MouseEvent) {
    // kartın linkine gitmesini engelle
    e.preventDefault();
    e.stopPropagation();

    const ok = window.confirm("Bu makaleyi silmek istediğinize emin misiniz?");
    if (!ok) return;

    try {
      await deleteArticle(id);
      toast.success("Makale silindi");

      onDeleted?.();

      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Makale silinirken hata oluştu"
      );
    }
  }

  return (
    <Button
      type="button"
      variant="destructive"
      size="icon"
      onClick={handleDelete}
      aria-label="Makaleyi sil"
      title="Makaleyi sil"
      className="h-8 w-8 rounded-full shadow-md bg-destructive/95 hover:bg-destructive z-20"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
