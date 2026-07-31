"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/AuthProvider";
import { nightsBetween, formatCurrency } from "@/lib/utils";

function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [rooms, setRooms] = useState([]);
  const [roomId, setRoomId] = useState(searchParams.get("room") || "");
  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") || "");
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") || "");
  const [guests, setGuests] = useState(searchParams.get("guests") || 2);

  const [status, setStatus] = useState("idle"); // idle | checking | unavailable | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    async function loadRooms() {
      const { data } = await supabase
        .from("rooms")
        .select("*")
        .eq("status", "available")
        .order("room_type");
      setRooms(data || []);
    }
    loadRooms();
  }, []);

  const selectedRoom = rooms.find((r) => r.id === roomId);
  const nights = nightsBetween(checkIn, checkOut);
  const total = selectedRoom ? nights * selectedRoom.price : 0;

  async function checkAvailability() {
    if (!roomId || !checkIn || !checkOut) return true;
    const { data, error } = await supabase
      .from("bookings")
      .select("id")
      .eq("room_id", roomId)
      .in("status", ["pending", "confirmed"])
      .lt("check_in", checkOut)
      .gt("check_out", checkIn);

    if (error) return true; // fail open on the pre-check; the DB constraint is the real guard
    return (data || []).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    if (!user) {
      router.push(`/login?redirect=/booking`);
      return;
    }
    if (!roomId || !checkIn || !checkOut) {
      setErrorMsg("Please choose a room and both dates.");
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      setErrorMsg("Check-out must be after check-in.");
      return;
    }

    setStatus("checking");
    const available = await checkAvailability();
    if (!available) {
      setStatus("unavailable");
      return;
    }

    setStatus("submitting");
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        customer_id: user.id,
        room_id: roomId,
        check_in: checkIn,
        check_out: checkOut,
        guests: Number(guests),
        total_price: total,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      setStatus("error");
      setErrorMsg(
        error.message.includes("no_overlapping_bookings")
          ? "That room was just booked for those dates. Please try different dates."
          : error.message
      );
      return;
    }

    setConfirmation(data);
    setStatus("success");
  }

  if (status === "success" && confirmation) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass mb-4">
          Reservation received
        </p>
        <h1 className="font-display text-4xl text-charcoal mb-6">
          You&apos;re on the books.
        </h1>
        <p className="text-charcoal/70 mb-8">
          Booking reference{" "}
          <span className="font-mono text-charcoal">
            {confirmation.id.slice(0, 8).toUpperCase()}
          </span>
          . A confirmation email and calendar invite are on their way once
          the front desk approves your stay.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-brass hover:bg-brass-light transition-colors text-ink font-mono text-xs uppercase tracking-[0.2em] px-8 py-4"
        >
          View my stays
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass mb-3">
        Reserve directly
      </p>
      <h1 className="font-display text-4xl text-charcoal mb-10">
        Book your stay
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-charcoal/50 mb-1">
            Room
          </label>
          <select
            required
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full border border-charcoal/20 bg-linen px-4 py-3 font-body"
          >
            <option value="">Select a room</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.room_type} — Room {r.room_number} ({formatCurrency(r.price)}/night)
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-charcoal/50 mb-1">
              Check in
            </label>
            <input
              required
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full border border-charcoal/20 bg-linen px-4 py-3 font-body"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-charcoal/50 mb-1">
              Check out
            </label>
            <input
              required
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full border border-charcoal/20 bg-linen px-4 py-3 font-body"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-charcoal/50 mb-1">
            Guests
          </label>
          <input
            required
            type="number"
            min={1}
            max={6}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full border border-charcoal/20 bg-linen px-4 py-3 font-body"
          />
        </div>

        {selectedRoom && nights > 0 && (
          <div className="border-t border-charcoal/10 pt-4 flex items-center justify-between font-body text-sm">
            <span className="text-charcoal/60">
              {nights} night{nights > 1 ? "s" : ""} × {formatCurrency(selectedRoom.price)}
            </span>
            <span className="font-display text-xl text-charcoal">
              {formatCurrency(total)}
            </span>
          </div>
        )}

        {status === "unavailable" && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3">
            That room is already booked for part of this date range. Try
            different dates or another room.
          </p>
        )}
        {errorMsg && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3">
            {errorMsg}
          </p>
        )}
        {!user && (
          <p className="text-sm text-charcoal/60 bg-stone px-4 py-3">
            You&apos;ll need to{" "}
            <Link href="/login?redirect=/booking" className="underline text-brass">
              sign in
            </Link>{" "}
            or{" "}
            <Link href="/register" className="underline text-brass">
              create an account
            </Link>{" "}
            to complete your reservation.
          </p>
        )}

        <button
          type="submit"
          disabled={status === "checking" || status === "submitting"}
          className="w-full bg-brass hover:bg-brass-light disabled:opacity-50 transition-colors text-ink font-mono text-xs uppercase tracking-[0.2em] py-4"
        >
          {status === "checking"
            ? "Checking availability…"
            : status === "submitting"
            ? "Reserving…"
            : "Confirm reservation"}
        </button>
      </form>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="max-w-xl mx-auto px-6 py-24 text-charcoal/50">Loading…</div>}>
      <BookingForm />
    </Suspense>
  );
}
