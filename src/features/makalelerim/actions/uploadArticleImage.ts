type UploadJson = { image?: { url?: string } };

export async function uploadArticleImageWithId(
  file: File,
  slug: string,
  id: string
): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append(
    "data",
    JSON.stringify({
      slug,
      image: { url: "" },
    })
  );

  const res = await fetch(`/api/makalelerim/${id}`, {
    method: "PATCH",
    credentials: "include",
    body: fd,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Görsel yüklenemedi");
  }

  const json: UploadJson = await res.json();
  return json.image?.url ?? "";
}

export async function uploadArticleImage(
  file: File,
  slug: string,
  id: string
): Promise<string> {
  return uploadArticleImageWithId(file, slug, id);
}
