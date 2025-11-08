"use client";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.alpertunaozkan.com";

type ErrorBagValue = { _errors?: Array<string | { message?: string }> };
type ApiError = { message?: string; errors?: Record<string, ErrorBagValue> };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function hasMessage(x: unknown): x is Required<Pick<ApiError, "message">> {
  return isRecord(x) && typeof x.message === "string" && x.message.trim() !== "";
}

function hasErrors(x: unknown): x is Required<Pick<ApiError, "errors">> {
  return (
    isRecord(x) &&
    "errors" in x &&
    isRecord(x.errors) &&
    Object.keys(x.errors).length > 0
  );
}

function formatErrorBag(bag: Record<string, ErrorBagValue | undefined>) {
  const parts: string[] = [];
  for (const [field, entry] of Object.entries(bag)) {
    if (!entry || !Array.isArray(entry._errors) || !entry._errors.length)
      continue;
    const first = entry._errors[0];
    const message =
      typeof first === "string"
        ? first
        : isRecord(first) && typeof first.message === "string"
          ? first.message
          : null;
    if (message) {
      parts.push(`${field}: ${message}`);
    }
  }
  return parts.join(" • ");
}

function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (normalizedPath === "/api" || normalizedPath.startsWith("/api/")) {
    return `${API_BASE}${normalizedPath}`;
  }
  return `${API_BASE}/api${normalizedPath}`;
}

type ApiInit = RequestInit & { parseJson?: boolean };

export async function apiFetch<T = unknown>(
  url: string,
  init?: ApiInit
): Promise<T> {
  const isAbs = /^https?:\/\//i.test(url);
  const target = isAbs ? url : buildApiUrl(url);

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
    else if (hasErrors(body)) {
      const friendly = formatErrorBag(body.errors);
      if (friendly) msg = friendly;
    } else if (typeof body === "string" && body) msg = body;
    throw new Error(msg);
  }

  return parse ? (body as T) : (undefined as T);
}
