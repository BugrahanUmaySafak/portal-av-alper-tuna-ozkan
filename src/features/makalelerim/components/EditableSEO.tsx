// src/features/makalelerim/components/EditableSEO.tsx
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
      <p className="text-sm text-muted-foreground">
        Bu alanlar arama sonuçlarında görünen bilgileri belirler. Teknik bilgi
        gerekmez; kısa ve anlaşılır doldurmanız yeterli.
      </p>

      <label className="grid gap-1">
        <span className="text-sm font-medium">SEO Başlığı</span>
        <input
          value={s.title}
          onChange={(e) => onChange({ ...s, title: e.target.value })}
          className="w-full rounded-md border px-3 py-2"
          aria-describedby="seo-title-help"
          placeholder="örn: Emlak Hukuku Rehberi | Şehir Avukatlık"
        />
        <span id="seo-title-help" className="text-xs text-muted-foreground">
          Arama sonuçlarında mavi başlık satırı olarak görünür. 45–60 karakter,
          net ve anahtar kelime içeren bir ifade yazın.
        </span>
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-medium">SEO Açıklaması</span>
        <textarea
          value={s.description}
          onChange={(e) => onChange({ ...s, description: e.target.value })}
          rows={3}
          className="w-full rounded-md border px-3 py-2"
          aria-describedby="seo-desc-help"
          placeholder="örn: Tapu, kira ve itiraz süreçlerini adım adım anlatan emlak hukuku rehberi. Uygulamalı örneklerle hızlıca başlayın."
        />
        <span id="seo-desc-help" className="text-xs text-muted-foreground">
          Arama sonuçlarındaki özet metindir. 120 ile 160 karakter arası, değeri
          anlatan açık bir cümle yazın.
        </span>
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-medium">Kanonik URL</span>
        <input
          value={s.canonicalUrl}
          onChange={(e) => onChange({ ...s, canonicalUrl: e.target.value })}
          className="w-full rounded-md border px-3 py-2"
          aria-describedby="seo-canon-help"
          placeholder="örn: https://siteadiniz.com/makaleler/emlak-hukuku-rehberi"
        />
        <span id="seo-canon-help" className="text-xs text-muted-foreground">
          İçeriğin tercih edilen tek adresi. Kopya içerik sorunlarını önler.
        </span>
      </label>
    </div>
  );
}
