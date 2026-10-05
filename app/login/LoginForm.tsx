"use client";

import { useActionState } from "react";
import { signIn, type SignInState } from "@/app/actions/auth";
import { Button } from "@/components/ui";

const inputClass =
  "mt-2 block min-h-12 w-full rounded-xl border-2 border-line bg-bg px-4 text-base text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<SignInState, FormData>(signIn, null);

  return (
    <form action={formAction} className="space-y-5">
      <label className="block">
        <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">Email</span>
        <input id="login-email" name="email" type="email" autoComplete="email" required className={inputClass} />
      </label>
      <label className="block">
        <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">Password</span>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </label>

      {state?.error && (
        <p role="alert" className="rounded-xl border-2 border-orange bg-bg px-4 py-3 text-sm font-medium">
          {state.error}
        </p>
      )}

      <Button id="login-submit" type="submit" disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
