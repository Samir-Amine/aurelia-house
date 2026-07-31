import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default function RoomCard({ room }) {
  return (
    <Link
      href={`/rooms/${room.id}`}
      className="group block bg-linen border border-charcoal/10 hover:border-brass transition-colors"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-forest">
        {room.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={room.image_url}
            alt={room.room_type}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brass/40 font-display text-4xl">
            {room.room_number}
          </div>
        )}

        {/* key-tag notch */}
        <div className="absolute -bottom-3 left-6 w-6 h-6 rounded-full bg-linen border border-charcoal/10" />
        <div className="absolute bottom-2 left-4 bg-ink text-brass font-mono text-[10px] tracking-[0.15em] px-3 py-1">
          RM {room.room_number}
        </div>
      </div>

      <div className="p-6 pt-8">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl text-charcoal">{room.room_type}</h3>
          <div className="text-right shrink-0">
            <div className="font-display text-lg text-charcoal">
              {formatCurrency(room.price)}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-charcoal/50">
              per night
            </div>
          </div>
        </div>
        <p className="mt-2 font-mono text-xs uppercase tracking-widest text-sage">
          Sleeps {room.capacity} · {room.status === "available" ? "Available" : "Currently unavailable"}
        </p>
      </div>
    </Link>
  );
}
