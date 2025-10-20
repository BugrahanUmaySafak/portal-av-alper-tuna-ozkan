"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteContact } from "@/features/iletisim/actions/deleteContact";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function ContactDelete({
  id,
  onDeleted,
}: {
  id: string;
  onDeleted?: () => void;
}) {
  const [loading, setLoading] = useState(false);

  function confirmDelete() {
    toast("Bu iletişim kaydını silmek istediğinize emin misiniz?", {
      action: {
        label: "Evet",
        onClick: async () => {
          try {
            setLoading(true);
            await deleteContact(id);
            toast.success("Kayıt silindi");
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
      onClick={confirmDelete}
      disabled={loading}
      className="h-8"
      title="Kaydı sil"
    >
      <Trash2 className="w-4 h-4 mr-1" />
      Sil
    </Button>
  );
}
