"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const links = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur border-b border-brass/20">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl tracking-wide text-linen">
          Aurelia House
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-mono text-xs uppercase tracking-[0.2em] text-linen/80 hover:text-brass transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-5">
          {user ? (
            <>
              <Link
                href={profile?.role === "admin" ? "/admin" : "/dashboard"}
                className="font-mono text-xs uppercase tracking-[0.2em] text-linen/80 hover:text-brass transition-colors"
              >
                {profile?.role === "admin" ? "Admin" : "My Stays"}
              </Link>
              <button
                onClick={signOut}
                className="font-mono text-xs uppercase tracking-[0.2em] text-linen/50 hover:text-brass transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="font-mono text-xs uppercase tracking-[0.2em] text-linen/80 hover:text-brass transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/booking"
                className="bg-brass text-ink font-mono text-xs uppercase tracking-[0.2em] px-5 py-2.5 hover:bg-brass-light transition-colors"
              >
                Reserve
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-linen"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-brass/20 px-6 py-6 flex flex-col gap-5 bg-ink">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-mono text-xs uppercase tracking-[0.2em] text-linen/80"
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                href={profile?.role === "admin" ? "/admin" : "/dashboard"}
                onClick={() => setOpen(false)}
                className="font-mono text-xs uppercase tracking-[0.2em] text-brass"
              >
                {profile?.role === "admin" ? "Admin" : "My Stays"}
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setOpen(false);
                }}
                className="font-mono text-xs uppercase tracking-[0.2em] text-linen/50 text-left"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="font-mono text-xs uppercase tracking-[0.2em] text-linen/80"
              >
                Sign in
              </Link>
              <Link
                href="/booking"
                onClick={() => setOpen(false)}
                className="bg-brass text-ink font-mono text-xs uppercase tracking-[0.2em] px-5 py-2.5 text-center"
              >
                Reserve
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
