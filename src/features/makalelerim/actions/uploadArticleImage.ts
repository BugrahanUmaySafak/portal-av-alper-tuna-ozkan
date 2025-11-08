"use client";

import { apiFetch } from "@/lib/api";

type SignatureResponse = {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder?: string;
  uploadPreset?: string;
};

type CloudinaryUploadResponse = {
  secure_url: string;
  public_id: string;
};

export type UploadedImage = {
  url: string;
  publicId: string;
  tinyUrl?: string;
};

type UploadOptions = {
  onProgress?: (value: number) => void;
};

export async function uploadArticleImage(
  file: File,
  opts?: UploadOptions
): Promise<UploadedImage> {
  const signature = await apiFetch<SignatureResponse>(
    "/api/uploads/signature",
    {
      method: "POST",
      body: JSON.stringify({ target: "article" }),
    }
  );

  const uploadUrl = `https://api.cloudinary.com/v1_1/${signature.cloudName}/auto/upload`;
  const fd = new FormData();
  fd.append("file", file);
  fd.append("api_key", signature.apiKey);
  fd.append("timestamp", String(signature.timestamp));
  fd.append("signature", signature.signature);
  if (signature.folder) fd.append("folder", signature.folder);
  if (signature.uploadPreset) fd.append("upload_preset", signature.uploadPreset);

  const result = await uploadWithProgress(uploadUrl, fd, opts?.onProgress);
  return {
    url: result.secure_url,
    publicId: result.public_id,
    tinyUrl: buildTinyUrl(result.secure_url),
  };
}

function uploadWithProgress(
  url: string,
  body: FormData,
  onProgress?: (value: number) => void
): Promise<CloudinaryUploadResponse> {
  if (typeof XMLHttpRequest === "undefined") {
    return fetch(url, {
      method: "POST",
      body,
    }).then(async (res) => {
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Cloudinary yüklemesi başarısız");
      }
      return (await res.json()) as CloudinaryUploadResponse;
    });
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const json = JSON.parse(xhr.responseText) as CloudinaryUploadResponse;
          resolve(json);
        } catch (err) {
          reject(err);
        }
      } else {
        reject(new Error(`Cloudinary ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error("Cloudinary yüklemesi başarısız"));

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      };
    }

    xhr.send(body);
  });
}

function buildTinyUrl(url: string): string | undefined {
  const marker = "/upload/";
  const idx = url.indexOf(marker);
  if (idx === -1) return undefined;
  const prefix = url.slice(0, idx + marker.length);
  const suffix = url.slice(idx + marker.length);
  const transform = "c_fill,w_60,h_40,q_auto:eco,f_auto,e_blur:200";
  return `${prefix}${transform}/${suffix}`;
}
