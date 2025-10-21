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

      const handleChange = () => {
        onChangeRef.current(q.root.innerHTML);
      };
      q.on("text-change", handleChange);

      quillRef.current = q;

      return () => {
        q.off("text-change", handleChange);
      };
    })();

    return () => {
      mounted = false;
      if (hostEl) hostEl.innerHTML = "";
      quillRef.current = null;
    };
  },[]);

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

  return <div ref={containerRef} className="min-h-[320px]" />;
}
