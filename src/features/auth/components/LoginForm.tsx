"use client";

import { useLogin } from "@/features/auth/hooks/useLogin";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function LoginForm() {
  const { username, password, setU, setP, loading, error, submit } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card className="shadow-sm">
      <CardContent>
        <form onSubmit={submit} className="grid gap-4">
          {/* Username */}
          <div className="grid gap-2">
            <Label htmlFor="username">Kullanıcı adı</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setU(e.target.value)}
              required
              placeholder="kullanıcı adınız"
              autoCapitalize="none"
              autoComplete="username"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Şifre</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setP(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <CardFooter className="px-0">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Giriş yapılıyor..." : "Giriş yap"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
