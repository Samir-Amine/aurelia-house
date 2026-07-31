"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { formatCurrency } from "@/lib/utils";

export default function RoomDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoom() {
      const { data } = await supabase.from("rooms").select("*").eq("id", id).single();
      setRoom(data);
      setLoading(false);
    }
    if (id) loadRoom();
  }, [id]);

  if (loading) {
    return <div className="max-w-4xl mx-auto px-6 py-24 text-charcoal/50">Loading…</div>;
  }

  if (!room) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24">
        <p className="text-charcoal/50">That room couldn&apos;t be found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full aspect-[16/7] bg-forest">
        {room.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={room.image_url} alt={room.room_type} className="w-full h-full object-cover" />
        )}
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          <p className="font-mono text-xs uppercase tracking-widest text-brass mb-2">
            Room {room.room_number}
          </p>
          <h1 className="font-display text-4xl text-charcoal mb-6">{room.room_type}</h1>
          <p className="text-charcoal/70 leading-relaxed">
            {room.description ||
              "A quiet, well-kept room with views toward the harbor. Furnished simply, cleaned thoroughly, and ready when you are."}
          </p>

          {room.amenities?.length > 0 && (
            <div className="mt-10">
              <h2 className="font-mono text-xs uppercase tracking-widest text-charcoal/50 mb-4">
                In the room
              </h2>
              <ul className="grid grid-cols-2 gap-2 text-sm text-charcoal/70">
                {room.amenities.map((a) => (
                  <li key={a}>· {a}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="border border-charcoal/10 p-6 h-fit sticky top-28">
          <div className="font-display text-3xl text-charcoal">
            {formatCurrency(room.price)}
            <span className="text-sm text-charcoal/50 font-body"> / night</span>
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-sage mt-2">
            Sleeps {room.capacity} · {room.status === "available" ? "Available" : "Unavailable"}
          </p>
          <button
            onClick={() => router.push(`/booking?room=${room.id}`)}
            disabled={room.status !== "available"}
            className="mt-6 w-full bg-brass hover:bg-brass-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-ink font-mono text-xs uppercase tracking-[0.2em] py-4"
          >
            Reserve this room
          </button>
        </aside>
      </div>
    </div>
  );
}
