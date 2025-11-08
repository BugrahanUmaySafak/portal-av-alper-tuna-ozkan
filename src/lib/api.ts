"use client";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001";

type ApiError = { message?: string };

function hasMessage(x: unknown): x is Required<ApiError> {
  return (
    typeof x === "object" &&
    x !== null &&
    "message" in (x as Record<string, unknown>) &&
    typeof (x as Record<string, unknown>).message === "string" &&
    (x as Record<string, unknown>).message !== ""
  );
}

type ApiInit = RequestInit & { parseJson?: boolean };

export async function apiFetch<T = unknown>(
  url: string,
  init?: ApiInit
): Promise<T> {
  const isAbs = /^https?:\/\//i.test(url);
  const target = isAbs ? url : `${API_BASE}${url}`;

  const isFD =
    typeof FormData !== "undefined" && init?.body instanceof FormData;

  const { parseJson, headers: initHeaders, cache, ...restInit } = init ?? {};

  const headers = isFD
    ? { ...(initHeaders || {}) }
    : { "Content-Type": "application/json", ...(initHeaders || {}) };

  const res = await fetch(target, {
    ...restInit,
    headers,
    credentials: "include",
    cache: cache ?? "no-store",
  });

  if (res.status === 204) {
    // void dönüşler için
    return undefined as T;
  }

  const parse = parseJson !== false;

  let body: unknown = null;
  if (parse) {
    try {
      body = await res.json();
    } catch {
      body = null;
    }
  }

  if (!res.ok) {
    let msg = "İstek başarısız";
    if (hasMessage(body)) msg = body.message;
    else if (typeof body === "string" && body) msg = body;
    throw new Error(msg);
  }

  return parse ? (body as T) : (undefined as T);
}
