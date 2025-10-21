"use client";

export default function EditableSEO({
  seo,
  onChange,
}: {
  seo?: { title: string; description: string; canonicalUrl: string };
  onChange: (next: {
    title: string;
    description: string;
    canonicalUrl: string;
  }) => void;
}) {
  const s = seo ?? { title: "", description: "", canonicalUrl: "" };

  return (
    <div className="grid gap-3">
      <h3 className="text-lg font-semibold">SEO</h3>

      <label className="grid gap-1">
        <span className="text-sm font-medium">SEO Başlığı</span>
        <input
          value={s.title}
          onChange={(e) => onChange({ ...s, title: e.target.value })}
          className="w-full rounded-md border px-3 py-2"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-medium">SEO Açıklaması</span>
        <textarea
          value={s.description}
          onChange={(e) => onChange({ ...s, description: e.target.value })}
          rows={3}
          className="w-full rounded-md border px-3 py-2"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-medium">Kanonik URL</span>
        <input
          value={s.canonicalUrl}
          onChange={(e) => onChange({ ...s, canonicalUrl: e.target.value })}
          className="w-full rounded-md border px-3 py-2"
        />
      </label>
    </div>
  );
}
