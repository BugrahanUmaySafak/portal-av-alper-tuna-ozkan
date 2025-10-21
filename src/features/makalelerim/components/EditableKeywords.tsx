"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function EditableKeywords({
  keywords,
  onChange,
}: {
  keywords: string[];
  onChange: (next: string[]) => void;
}) {
  const [input, setInput] = useState("");

  function add() {
    const v = input.trim();
    if (!v) return;
    if (keywords.includes(v)) return;
    onChange([...keywords, v]);
    setInput("");
  }

  return (
    <div>
      <label className="text-sm font-medium">Anahtar Kelimeler</label>
      <div className="mt-2 flex flex-wrap gap-2">
        {keywords.map((k) => (
          <Badge key={k} className="gap-1">
            {k}
            <button
              type="button"
              onClick={() => onChange(keywords.filter((x) => x !== k))}
              className="ml-1 opacity-70 hover:opacity-100"
              aria-label={`${k} anahtar kelimesini kaldır`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </Badge>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder="kelime ekle ve Enter"
          className="flex-1 rounded-md border px-3 py-2"
        />
        <button
          type="button"
          onClick={add}
          className="rounded-md border px-3 py-2 hover:bg-accent"
        >
          Ekle
        </button>
      </div>
    </div>
  );
}
