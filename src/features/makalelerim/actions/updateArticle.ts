export async function updateArticle(
  id: string,
  patch: Record<string, unknown>
) {
  const res = await fetch(`/api/makalelerim/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || "Güncelleme başarısız");
  }
  return res.json();
}
