"use client";

import { useState } from "react";
import type { Video } from "@/features/videolarim/types";
import { createVideo } from "../actions/createVideo";

export function useCreateVideo() {
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState<string>("");

  async function submit(payload: { title: string; youtubeId: string }) {
    try {
      setErr("");
      setLoading(true);
      const v: Video = await createVideo(payload);
      return v;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Bir hata oluştu";
      setErr(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { submit, loading, error };
}
