"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/AuthProvider";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-charcoal/5 text-charcoal/50 border-charcoal/10",
  completed: "bg-sky-50 text-sky-700 border-sky-200",
};

export default function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/dashboard");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    async function loadBookings() {
      if (!user) return;
      const { data } = await supabase
        .from("bookings")
        .select("*, rooms(room_type, room_number, image_url)")
        .eq("customer_id", user.id)
        .order("check_in", { ascending: false });
      setBookings(data || []);
      setLoading(false);
    }
    loadBookings();
  }, [user]);

  async function handleCancel(bookingId) {
    setCancellingId(bookingId);
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", bookingId);
    if (!error) {
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" } : b))
      );
    }
    setCancellingId(null);
  }

  if (authLoading || !user) {
    return <div className="max-w-5xl mx-auto px-6 py-24 text-charcoal/50">Loading…</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass mb-3">
        Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
      </p>
      <h1 className="font-display text-4xl text-charcoal mb-10">My stays</h1>

      {loading ? (
        <p className="text-charcoal/50">Loading your bookings…</p>
      ) : bookings.length === 0 ? (
        <div className="border border-charcoal/10 p-10 text-center">
          <p className="text-charcoal/60 mb-6">You haven&apos;t booked a stay yet.</p>
          <Link
            href="/rooms"
            className="inline-block bg-brass hover:bg-brass-light transition-colors text-ink font-mono text-xs uppercase tracking-[0.2em] px-8 py-3"
          >
            Browse rooms
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="border border-charcoal/10 p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-8"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-display text-lg text-charcoal">
                    {b.rooms?.room_type || "Room"}
                  </h3>
                  <span
                    className={`text-[10px] font-mono uppercase tracking-widest border px-2 py-0.5 ${statusStyles[b.status] || ""}`}
                  >
                    {b.status}
                  </span>
                </div>
                <p className="text-sm text-charcoal/60 font-mono">
                  {formatDate(b.check_in)} → {formatDate(b.check_out)} · {b.guests} guest
                  {b.guests > 1 ? "s" : ""}
                </p>
                <p className="text-xs text-charcoal/40 font-mono mt-1">
                  Ref {b.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <div className="text-right">
                <div className="font-display text-xl text-charcoal mb-2">
                  {formatCurrency(b.total_price)}
                </div>
                {b.status === "pending" && (
                  <button
                    onClick={() => handleCancel(b.id)}
                    disabled={cancellingId === b.id}
                    className="font-mono text-xs uppercase tracking-widest text-red-700 hover:underline disabled:opacity-50"
                  >
                    {cancellingId === b.id ? "Cancelling…" : "Cancel"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
