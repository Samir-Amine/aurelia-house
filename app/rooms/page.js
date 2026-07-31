"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import RoomCard from "@/components/RoomCard";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [capacityFilter, setCapacityFilter] = useState("any");
  const [sort, setSort] = useState("price-asc");

  useEffect(() => {
    async function loadRooms() {
      setLoading(true);
      const { data } = await supabase.from("rooms").select("*");
      setRooms(data || []);
      setLoading(false);
    }
    loadRooms();
  }, []);

  const filtered = rooms
    .filter((r) => r.status === "available")
    .filter((r) => (capacityFilter === "any" ? true : r.capacity >= Number(capacityFilter)))
    .sort((a, b) => (sort === "price-asc" ? a.price - b.price : b.price - a.price));

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass mb-3">
        Nineteen rooms, no two alike
      </p>
      <h1 className="font-display text-4xl md:text-5xl text-charcoal mb-10">
        All rooms
      </h1>

      <div className="flex flex-wrap gap-6 mb-12 pb-6 border-b border-charcoal/10">
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-charcoal/50 mb-1">
            Guests
          </label>
          <select
            value={capacityFilter}
            onChange={(e) => setCapacityFilter(e.target.value)}
            className="border border-charcoal/20 bg-linen px-4 py-2 font-body text-sm"
          >
            <option value="any">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-charcoal/50 mb-1">
            Sort by
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-charcoal/20 bg-linen px-4 py-2 font-body text-sm"
          >
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-charcoal/50">Loading rooms…</p>
      ) : filtered.length === 0 ? (
        <p className="text-charcoal/50">
          No rooms match those filters right now.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {filtered.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}
