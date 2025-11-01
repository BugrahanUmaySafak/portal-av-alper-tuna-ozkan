// src/features/auth/containers/AuthWrapper.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/features/auth/hooks/getSession";
import LoginForm from "@/features/auth/components/LoginForm";

export default async function AuthWrapper() {
  const user = await getSession();
  if (user) {
    // zaten login olmuş → panele gönder
    redirect("/anasayfa");
  }

  return (
    <main className="relative min-h-dvh grid place-items-center bg-gradient-to-b from-slate-50 to-slate-100 p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(45rem_30rem_at_50%_10%,white,transparent)]"
      >
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_1px_1px,_#000_1px,_transparent_1px)] bg-[size:20px_20px]" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 size-[520px] rounded-full bg-gradient-to-tr from-blue-600/10 via-blue-400/10 to-emerald-500/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Üst başlık */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 inline-flex items-center justify-center rounded-full bg-blue-600 text-white shadow-md px-3 py-2 max-w-full">
            <span className="text-sm sm:text-base font-semibold leading-none truncate">
              Alper Tuna Özkan
            </span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Yönetim Paneli
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Yetkili kullanıcılar için giriş ekranı
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
