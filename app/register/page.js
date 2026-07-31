"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // If email confirmations are on, there's no session yet — show a message.
    if (!data.session) {
      setSent(true);
      return;
    }

    router.push("/dashboard");
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-charcoal mb-4">
          Check your inbox
        </h1>
        <p className="text-charcoal/70">
          We sent a confirmation link to <strong>{email}</strong>. Click it to
          activate your account, then come back and sign in.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass mb-3">
        First time here
      </p>
      <h1 className="font-display text-4xl text-charcoal mb-10">
        Create an account
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-charcoal/50 mb-1">
            Full name
          </label>
          <input
            required
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-charcoal/20 bg-linen px-4 py-3 font-body"
          />
        </div>
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
            minLength={6}
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
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-8 text-sm text-charcoal/60">
        Already a guest?{" "}
        <Link href="/login" className="underline text-brass">
          Sign in
        </Link>
      </p>
    </div>
  );
}
