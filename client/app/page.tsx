"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, LogOut, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

function ProfileSkeleton() {
  return (
    <div className="flex w-full flex-col items-center gap-5 animate-pulse">
      <div className="size-24 rounded-full bg-emerald-500/15" />
      <div className="h-5 w-40 rounded-md bg-emerald-500/15" />
      <div className="h-4 w-56 rounded-md bg-emerald-500/10" />
      <div className="mt-2 h-10 w-full rounded-lg bg-emerald-500/10" />
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [signingOut, setSigningOut] = useState(false);

  // not logged in -> go to /signin
  useEffect(() => {
    if (!isPending && !session) router.replace("/signin");
  }, [isPending, session, router]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => router.replace("/signin"),
        },
      });
    } finally {
      setSigningOut(false);
    }
  };

  const user = session?.user;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* background glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 size-[32rem] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 size-[24rem] rounded-full bg-teal-500/10 blur-[120px]" />

      <section className="relative w-full max-w-sm rounded-3xl border border-emerald-500/20 bg-card/60 p-8 shadow-2xl shadow-emerald-950/40 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-500">
        {/* brand */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-300 to-emerald-600 text-emerald-950">
            <Terminal className="size-5" />
          </div>
          <span className="text-xl font-semibold tracking-tight">Orbii CLI</span>
        </div>

        {/* skeleton while checking the session, and while redirecting logged-out users */}
        {isPending || !user ? (
          <ProfileSkeleton />
        ) : (
          <div className="flex flex-col items-center gap-1 text-center animate-in fade-in duration-500">
            <div className="relative mb-4">
              <div className="absolute inset-0 rounded-full bg-emerald-400/40 blur-xl" />
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name ?? "Profile picture"}
                  width={96}
                  height={96}
                  priority
                  className="relative size-24 rounded-full object-cover ring-2 ring-emerald-400/70 ring-offset-4 ring-offset-background"
                />
              ) : (
                <div className="relative flex size-24 items-center justify-center rounded-full bg-emerald-500/20 text-3xl font-semibold ring-2 ring-emerald-400/70 ring-offset-4 ring-offset-background">
                  {user.name?.[0]?.toUpperCase() ?? "U"}
                </div>
              )}
              <span className="absolute bottom-1 right-1 size-4 rounded-full border-2 border-background bg-emerald-400" />
            </div>

            <p className="text-sm text-emerald-400">Welcome back</p>
            <h1 className="text-2xl font-semibold tracking-tight">{user.name}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>

            <Button
              onClick={handleSignOut}
              disabled={signingOut}
              variant="outline"
              className="mt-8 h-11 w-full gap-2 rounded-xl border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-300"
            >
              {signingOut ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Signing out...
                </>
              ) : (
                <>
                  <LogOut className="size-4" /> Log out
                </>
              )}
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}