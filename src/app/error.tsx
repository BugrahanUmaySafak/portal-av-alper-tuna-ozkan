"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Hata:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center bg-[#fdf8f2] text-center ">
      <h1 className="text-xl font-semibold text-red-600">Bir hata oluştu</h1>
      <p className="mt-2 text-gray-600">
        Lütfen tekrar deneyin veya daha sonra kontrol edin.
      </p>
      <Button onClick={reset} className="mt-4">
        Yeniden Dene
      </Button>
    </div>
  );
}
