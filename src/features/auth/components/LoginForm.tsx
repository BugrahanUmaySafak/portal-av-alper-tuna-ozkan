"use client";

import { useLogin } from "@/features/auth/hooks/useLogin";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useState } from "react";

export default function LoginForm() {
  const { username, password, setU, setP, loading, error, submit } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card className="shadow-xl/10 border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="pt-6">
        <form onSubmit={submit} className="grid gap-4">
          {/* Username */}
          <div className="grid gap-2">
            <Label htmlFor="username">Kullanıcı adı</Label>
            <div className="relative">
              <User
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
              />
              <Input
                id="username"
                value={username}
                onChange={(e) => setU(e.target.value)}
                required
                placeholder="kullanıcı adınız"
                autoCapitalize="none"
                autoComplete="username"
                className="pl-9"
              />
            </div>
          </div>

          {/* Password */}
          <div className="grid gap-2">
            <Label htmlFor="password">Şifre</Label>
            <div className="relative">
              <Lock
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
              />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setP(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete="current-password"
                className="pl-9 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center rounded-md px-2 py-1 text-slate-500 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Hata */}
          {error && (
            <p
              className="text-sm text-destructive"
              role="alert"
              aria-live="polite"
            >
              {error}
            </p>
          )}

          <CardFooter className="px-0 pt-2">
            <Button
              type="submit"
              className="w-full h-10 font-medium shadow-sm hover:shadow transition-shadow"
              disabled={loading}
            >
              {loading ? "Giriş yapılıyor..." : "Giriş yap"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
