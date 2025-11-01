"use client";

import { useState } from "react";
import { useCategories } from "../hooks/useCategories"; // 👈 burada düzeltme
import { createCategory } from "../actions/createCategory";
import { updateCategory } from "../actions/updateCategory";
import { deleteCategory } from "../actions/deleteCategory";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function CategoriesManager() {
  const { categories, mutate, isLoading, isError, error } = useCategories();
  const [newName, setNewName] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  async function handleCreate() {
    const name = newName.trim();
    if (!name) return;
    try {
      await createCategory(name);
      setNewName("");
      await mutate();
      toast.success("Kategori eklendi");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Kategori eklenemedi");
    }
  }

  async function handleUpdate(id: string) {
    const name = editingName.trim();
    if (!name) return;
    try {
      await updateCategory(id, name);
      setEditingId(null);
      setEditingName("");
      await mutate();
      toast.success("Kategori güncellendi");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Kategori güncellenemedi");
    }
  }

  async function handleDelete(id: string) {
    const ok = window.confirm("Kategoriyi silmek istediğinize emin misiniz?");
    if (!ok) return;
    try {
      await deleteCategory(id);
      await mutate();
      toast.success("Kategori silindi");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Kategori silinemedi");
    }
  }

  if (isLoading) return <div>Yükleniyor…</div>;
  if (isError)
    return (
      <div className="text-destructive">
        {error instanceof Error ? error.message : "Bir hata oluştu"}
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Ekle */}
      <Card className="p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Yeni kategori adı"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-1" />
            Ekle
          </Button>
        </div>
      </Card>

      {/* Liste */}
      <Card className="p-4">
        <div className="space-y-2">
          {categories.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-2 border rounded-md px-3 py-2"
            >
              {editingId === c.id ? (
                <>
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleUpdate(c.id)}
                    title="Kaydet"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setEditingId(null);
                      setEditingName("");
                    }}
                    title="Vazgeç"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex-1">{c.name}</div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setEditingId(c.id);
                      setEditingName(c.name);
                    }}
                    title="Düzenle"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDelete(c.id)}
                    title="Sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          ))}
          {categories.length === 0 && (
            <div className="text-sm text-muted-foreground">
              Henüz kategori yok.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
