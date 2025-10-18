import { redirect } from "next/navigation";
import LoginForm from "@/features/auth/components/LoginForm";
import { getSession } from "@/features/auth/hooks/getSession";

export default async function AuthWrapper() {
  const user = await getSession();
  if (user) redirect("/dashboard");

  return (
    <main className="min-h-dvh grid place-items-center bg-muted p-6">
      <div className="w-full max-w-md">
        <h1 className="mb-4 text-center text-2xl font-semibold">
          Portal -Domain- Giriş{" "}
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}
