"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push(redirect);
  }

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass mb-3">
        Welcome back
      </p>
      <h1 className="font-display text-4xl text-charcoal mb-10">Sign in</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-charcoal/50 mb-1">
            Email
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-charcoal/20 bg-linen px-4 py-3 font-body"
          />
        </div>
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-charcoal/50 mb-1">
            Password
          </label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-charcoal/20 bg-linen px-4 py-3 font-body"
          />
        </div>

        {error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brass hover:bg-brass-light disabled:opacity-50 transition-colors text-ink font-mono text-xs uppercase tracking-[0.2em] py-4"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-8 text-sm text-charcoal/60">
        New here?{" "}
        <Link href="/register" className="underline text-brass">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-6 py-24 text-charcoal/50">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
