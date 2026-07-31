"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Anchor, Waves, Coffee, Wifi } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import RoomCard from "@/components/RoomCard";
import SectionDivider from "@/components/SectionDivider";

const amenities = [
  { icon: Waves, title: "Tidal pool spa", copy: "Heated saltwater, open dawn to midnight." },
  { icon: Coffee, title: "Harbor pantry", copy: "Local roast coffee and pastry, always on." },
  { icon: Anchor, title: "Private dock", copy: "Moorings for guests arriving by boat." },
  { icon: Wifi, title: "Wired for work", copy: "Fiber internet in every room, no exceptions." },
];

const testimonials = [
  {
    quote:
      "The kind of quiet you have to drive three hours to find, with a bed better than the one at home.",
    name: "R. Okafor",
  },
  {
    quote:
      "Booked a room with a bad forecast and a good instinct. Both paid off.",
    name: "M. Laurent",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [rooms, setRooms] = useState([]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    async function loadRooms() {
      const { data } = await supabase
        .from("rooms")
        .select("*")
        .eq("status", "available")
        .order("price", { ascending: true })
        .limit(3);
      setRooms(data || []);
    }
    loadRooms();
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", guests);
    router.push(`/rooms?${params.toString()}`);
  }

  return (
    <div>
      {/* HERO — the reservation thesis */}
      <section className="relative bg-ink text-linen overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-32">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass mb-6">
            Port Aurelia, Maine · Est. 1961
          </p>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.05] max-w-3xl">
            Nineteen rooms,
            <br />
            one tide away.
          </h1>
          <p className="mt-6 max-w-lg text-linen/70 text-lg">
            A working harbor hotel, restored room by room. Check availability
            below and reserve directly — no booking fee, no third party.
          </p>

          {/* search widget */}
          <form
            onSubmit={handleSearch}
            className="mt-12 bg-linen text-charcoal p-6 md:p-2 flex flex-col md:flex-row gap-4 md:gap-0 md:items-stretch max-w-3xl"
          >
            <div className="flex-1 px-4 py-3 md:border-r border-charcoal/10">
              <label className="block font-mono text-[10px] uppercase tracking-widest text-charcoal/50 mb-1">
                Check in
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-transparent outline-none font-body"
              />
            </div>
            <div className="flex-1 px-4 py-3 md:border-r border-charcoal/10">
              <label className="block font-mono text-[10px] uppercase tracking-widest text-charcoal/50 mb-1">
                Check out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-transparent outline-none font-body"
              />
            </div>
            <div className="flex-1 px-4 py-3 md:border-r border-charcoal/10">
              <label className="block font-mono text-[10px] uppercase tracking-widest text-charcoal/50 mb-1">
                Guests
              </label>
              <input
                type="number"
                min={1}
                max={6}
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full bg-transparent outline-none font-body"
              />
            </div>
            <button
              type="submit"
              className="bg-brass hover:bg-brass-light transition-colors text-ink font-mono text-xs uppercase tracking-[0.2em] px-8 py-4 md:py-0 whitespace-nowrap"
            >
              Check stays
            </button>
          </form>
        </div>
      </section>

      <div className="bg-ink"><SectionDivider tone="brass" /></div>

      {/* FEATURED ROOMS */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass mb-3">
              The rooms
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-charcoal">
              Where to stay
            </h2>
          </div>
          <Link
            href="/rooms"
            className="hidden md:block font-mono text-xs uppercase tracking-[0.2em] text-charcoal/60 hover:text-brass"
          >
            View all rooms →
          </Link>
        </div>

        {rooms.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        ) : (
          <p className="text-charcoal/50 font-body">
            Rooms will appear here once your Supabase{" "}
            <code className="font-mono text-sm">rooms</code> table has data.
          </p>
        )}

        <Link
          href="/rooms"
          className="md:hidden mt-8 inline-block font-mono text-xs uppercase tracking-[0.2em] text-charcoal/60 hover:text-brass"
        >
          View all rooms →
        </Link>
      </section>

      <SectionDivider />

      {/* AMENITIES */}
      <section className="bg-forest text-linen">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass mb-3">
            On the property
          </p>
          <h2 className="font-display text-3xl md:text-4xl mb-14">Amenities</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {amenities.map(({ icon: Icon, title, copy }) => (
              <div key={title}>
                <Icon className="text-brass mb-4" size={28} strokeWidth={1.5} />
                <h3 className="font-display text-lg mb-2">{title}</h3>
                <p className="text-linen/60 text-sm leading-relaxed">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass mb-3">
          From the guestbook
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-14">
          What guests say
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          {testimonials.map((t) => (
            <blockquote key={t.name} className="border-l-2 border-brass pl-6">
              <p className="font-display text-xl md:text-2xl leading-snug text-charcoal">
                “{t.quote}”
              </p>
              <cite className="block mt-4 font-mono text-xs uppercase tracking-widest text-charcoal/50 not-italic">
                {t.name}
              </cite>
            </blockquote>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-linen">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <h2 className="font-display text-3xl md:text-5xl mb-6">
            The tide won&apos;t wait.
          </h2>
          <p className="text-linen/60 max-w-md mx-auto mb-10">
            Rooms fill quickly in the shoulder season. Reserve directly and
            we&apos;ll hold your room with no card required until check-in.
          </p>
          <Link
            href="/booking"
            className="inline-block bg-brass hover:bg-brass-light transition-colors text-ink font-mono text-xs uppercase tracking-[0.2em] px-10 py-4"
          >
            Reserve your stay
          </Link>
        </div>
      </section>
    </div>
  );
}
