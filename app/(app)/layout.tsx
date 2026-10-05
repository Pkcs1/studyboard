import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { signOut } from "@/app/actions/auth";
import { TabNav } from "@/components/TabNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { createClient } from "@/lib/supabase/server";

/**
 * Shell for every logged-in page (the "(app)" folder name doesn't appear in URLs).
 * Double-checks login on the server, even though proxy.ts already does it.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/login");

  const email = typeof data.claims.email === "string" ? data.claims.email : "";

  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-5 sm:px-8">
        <span className="font-display text-sm font-extrabold uppercase tracking-tight">Studyboard</span>
        <div className="order-last w-full sm:order-none sm:w-auto">
          <TabNav />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <form action={signOut}>
            <button
              id="sign-out"
              type="submit"
              title={email ? `Signed in as ${email}` : undefined}
              className="min-h-11 rounded-full px-4 font-mono text-xs uppercase tracking-wider text-ink-muted hover:text-ink"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 pb-24 sm:px-8">{children}</main>
    </div>
  );
}
