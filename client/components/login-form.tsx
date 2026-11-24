"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { authClient } from "@/lib/auth-client";

const REDIRECT_PATH = "/"; // where users land after login

const LoginForm = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // already logged in -> skip the login page
  useEffect(() => {
    if (session) router.replace(REDIRECT_PATH);
  }, [session, router]);

  const handleLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await authClient.signIn.social({
        provider: "github",
        callbackURL: `${window.location.origin}${REDIRECT_PATH}`,
      });
      if (res?.error) throw new Error(res.error.message);
      // success: the browser is redirected to GitHub, so keep the spinner
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  // checking the session, or logged in and redirecting
  if (isPending || session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center justify-center space-y-4">
        <Image src="/login-bro.svg" alt="login" height={450} width={450} priority />

        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col gap-4">
            <Button
              variant="outline"
              className="h-full w-full cursor-pointer gap-2 p-3"
              type="button"
              disabled={isLoading}
              onClick={handleLogin}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Redirecting to GitHub...
                </>
              ) : (
                <>
                  <Image
                    src="/github.svg"
                    alt="GitHub"
                    height={16}
                    width={16}
                    className="size-4 dark:invert"
                  />
                  Continue with GitHub
                </>
              )}
            </Button>

            {error && <p className="text-center text-sm text-red-400">{error}</p>}
          </CardContent>
        </Card>

        <h1 className="text-center text-4xl font-extrabold text-indigo-400 md:text-6xl">
          Welcome Back! to Orbii CLI
        </h1>
        <p className="text-base font-medium text-zinc-400">
          Login to your account for allowing device flow
        </p>
      </div>
    </div>
  );
};

export { LoginForm };