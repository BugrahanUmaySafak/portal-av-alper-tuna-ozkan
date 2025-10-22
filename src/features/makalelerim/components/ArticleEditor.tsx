// src/features/makalelerim/components/ArticleEditor.tsx
"use client";
import { useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";

export default function ArticleEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<import("quill").default | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    let mounted = true;
    const hostEl = containerRef.current;

    (async () => {
      if (!hostEl || quillRef.current) return;
      const { default: Quill } = await import("quill");
      if (!mounted) return;

      const el = document.createElement("div");
      hostEl.appendChild(el);

      const q = new Quill(el, {
        theme: "snow",
        placeholder:
          "Örn: Giriş paragrafı yazın. Alt başlıklar (H2/H3), maddeli listeler ve bağlantılar ekleyebilirsiniz.",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
            ["clean"],
          ],
        },
      });

      q.clipboard.dangerouslyPasteHTML(value || "");
      const handleChange = () => onChangeRef.current(q.root.innerHTML);
      q.on("text-change", handleChange);
      quillRef.current = q;

      return () => q.off("text-change", handleChange);
    })();

    return () => {
      mounted = false;
      if (hostEl) hostEl.innerHTML = "";
      quillRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const q = quillRef.current;
    if (!q) return;
    const current = q.root.innerHTML;
    if (current !== value) {
      const sel = q.getSelection();
      q.clipboard.dangerouslyPasteHTML(value || "");
      if (sel) q.setSelection(sel);
    }
  }, [value]);

  return (
    <div
      ref={containerRef}
      className="min-h-[320px]
      [&_.ql-editor]:text-[15px] [&_.ql-editor]:leading-7
      [&_.ql-editor_p]:m-0
      [&_.ql-editor_h2]:m-0 [&_.ql-editor_h2]:text-2xl [&_.ql-editor_h2]:font-semibold
      [&_.ql-editor_h3]:m-0 [&_.ql-editor_h3]:text-xl [&_.ql-editor_h3]:font-semibold
      [&_.ql-editor_ul]:my-4 [&_.ql-editor_ul]:pl-6
      [&_.ql-editor_ol]:my-4 [&_.ql-editor_ol]:pl-6
      [&_.ql-editor_li]:my-1"
    />
  );
}
