// src/features/makalelerim/actions/uploadArticleImage.ts
type UploadJson = { image?: { url?: string } };

export async function uploadArticleImageWithId(
  file: File,
  slug: string,
  id: string
): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("data", JSON.stringify({ slug }));

  const res = await fetch(`/api/makalelerim/${id}`, {
    method: "PATCH",
    credentials: "include",
    body: fd,
  });

  if (!res.ok) {
    throw new Error((await res.text().catch(() => "")) || "Görsel yüklenemedi");
  }

  const json: UploadJson = await res.json();
  return json.image?.url ?? "";
}
