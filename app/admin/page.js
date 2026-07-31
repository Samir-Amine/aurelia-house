"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/AuthProvider";
import { formatCurrency, formatDate } from "@/lib/utils";

const emptyRoom = {
  room_number: "",
  room_type: "",
  capacity: 2,
  price: "",
  status: "available",
  description: "",
  image_url: "",
};

export default function AdminPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    if (!authLoading && (!user || profile?.role !== "admin")) {
      router.push(user ? "/dashboard" : "/login?redirect=/admin");
    }
  }, [authLoading, user, profile, router]);

  if (authLoading || !user || profile?.role !== "admin") {
    return <div className="max-w-6xl mx-auto px-6 py-24 text-charcoal/50">Loading…</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass mb-3">
        Front desk
      </p>
      <h1 className="font-display text-4xl text-charcoal mb-10">Admin dashboard</h1>

      <div className="flex gap-8 border-b border-charcoal/10 mb-10">
        {["overview", "bookings", "rooms"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-4 font-mono text-xs uppercase tracking-widest ${
              tab === t
                ? "text-charcoal border-b-2 border-brass"
                : "text-charcoal/40"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" && <Overview />}
      {tab === "bookings" && <BookingsManager />}
      {tab === "rooms" && <RoomsManager />}
    </div>
  );
}

function Overview() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    async function loadMetrics() {
      const [{ data: bookings }, { data: rooms }] = await Promise.all([
        supabase.from("bookings").select("status, total_price, created_at"),
        supabase.from("rooms").select("status"),
      ]);

      const totalRevenue = (bookings || [])
        .filter((b) => b.status !== "cancelled")
        .reduce((sum, b) => sum + Number(b.total_price || 0), 0);

      setMetrics({
        totalBookings: bookings?.length || 0,
        pending: (bookings || []).filter((b) => b.status === "pending").length,
        confirmed: (bookings || []).filter((b) => b.status === "confirmed").length,
        totalRevenue,
        availableRooms: (rooms || []).filter((r) => r.status === "available").length,
        totalRooms: rooms?.length || 0,
      });
    }
    loadMetrics();
  }, []);

  if (!metrics) return <p className="text-charcoal/50">Loading metrics…</p>;

  const cards = [
    { label: "Total bookings", value: metrics.totalBookings },
    { label: "Pending approval", value: metrics.pending },
    { label: "Confirmed stays", value: metrics.confirmed },
    { label: "Revenue booked", value: formatCurrency(metrics.totalRevenue) },
    { label: "Rooms available", value: `${metrics.availableRooms} / ${metrics.totalRooms}` },
  ];

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
      {cards.map((c) => (
        <div key={c.label} className="border border-charcoal/10 p-6">
          <div className="font-mono text-[10px] uppercase tracking-widest text-charcoal/50 mb-2">
            {c.label}
          </div>
          <div className="font-display text-3xl text-charcoal">{c.value}</div>
        </div>
      ))}
    </div>
  );
}

function BookingsManager() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [filter, setFilter] = useState("all");

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("bookings")
      .select("*, rooms(room_type, room_number), profiles(full_name, email)")
      .order("created_at", { ascending: false });
    setBookings(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id, status) {
    setBusyId(id);
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (!error) {
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    }
    setBusyId(null);
  }

  const visible = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  if (loading) return <p className="text-charcoal/50">Loading bookings…</p>;

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {["all", "pending", "confirmed", "cancelled", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border ${
              filter === f
                ? "bg-ink text-linen border-ink"
                : "border-charcoal/20 text-charcoal/60"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left font-mono text-[10px] uppercase tracking-widest text-charcoal/50 border-b border-charcoal/10">
              <th className="py-3 pr-4">Guest</th>
              <th className="py-3 pr-4">Room</th>
              <th className="py-3 pr-4">Dates</th>
              <th className="py-3 pr-4">Total</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((b) => (
              <tr key={b.id} className="border-b border-charcoal/5">
                <td className="py-3 pr-4">
                  {b.profiles?.full_name || b.profiles?.email || "—"}
                </td>
                <td className="py-3 pr-4">
                  {b.rooms?.room_type} #{b.rooms?.room_number}
                </td>
                <td className="py-3 pr-4 font-mono text-xs">
                  {formatDate(b.check_in)} → {formatDate(b.check_out)}
                </td>
                <td className="py-3 pr-4">{formatCurrency(b.total_price)}</td>
                <td className="py-3 pr-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest">
                    {b.status}
                  </span>
                </td>
                <td className="py-3 pr-4 space-x-3 whitespace-nowrap">
                  {b.status === "pending" && (
                    <button
                      disabled={busyId === b.id}
                      onClick={() => updateStatus(b.id, "confirmed")}
                      className="font-mono text-[10px] uppercase tracking-widest text-emerald-700 hover:underline disabled:opacity-50"
                    >
                      Approve
                    </button>
                  )}
                  {b.status !== "cancelled" && b.status !== "completed" && (
                    <button
                      disabled={busyId === b.id}
                      onClick={() => updateStatus(b.id, "cancelled")}
                      className="font-mono text-[10px] uppercase tracking-widest text-red-700 hover:underline disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RoomsManager() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // room object or null
  const [form, setForm] = useState(emptyRoom);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("rooms").select("*").order("room_number");
    setRooms(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(room) {
    setEditing(room || "new");
    setForm(room ? { ...room } : emptyRoom);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      room_number: form.room_number,
      room_type: form.room_type,
      capacity: Number(form.capacity),
      price: Number(form.price),
      status: form.status,
      description: form.description,
      image_url: form.image_url,
    };

    const { error } =
      editing === "new"
        ? await supabase.from("rooms").insert(payload)
        : await supabase.from("rooms").update(payload).eq("id", editing.id);

    setSaving(false);
    if (!error) {
      setEditing(null);
      load();
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this room? This cannot be undone.")) return;
    await supabase.from("rooms").delete().eq("id", id);
    load();
  }

  if (loading) return <p className="text-charcoal/50">Loading rooms…</p>;

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => startEdit(null)}
          className="bg-brass hover:bg-brass-light transition-colors text-ink font-mono text-xs uppercase tracking-[0.2em] px-5 py-2.5"
        >
          + Add room
        </button>
      </div>

      {editing && (
        <form
          onSubmit={handleSave}
          className="border border-charcoal/10 p-6 mb-8 grid sm:grid-cols-2 gap-4"
        >
          <input
            required
            placeholder="Room number"
            value={form.room_number}
            onChange={(e) => setForm({ ...form, room_number: e.target.value })}
            className="border border-charcoal/20 bg-linen px-4 py-3 font-body"
          />
          <input
            required
            placeholder="Room type (e.g. Harbor Suite)"
            value={form.room_type}
            onChange={(e) => setForm({ ...form, room_type: e.target.value })}
            className="border border-charcoal/20 bg-linen px-4 py-3 font-body"
          />
          <input
            required
            type="number"
            min={1}
            placeholder="Capacity"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            className="border border-charcoal/20 bg-linen px-4 py-3 font-body"
          />
          <input
            required
            type="number"
            min={0}
            placeholder="Price per night"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border border-charcoal/20 bg-linen px-4 py-3 font-body"
          />
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="border border-charcoal/20 bg-linen px-4 py-3 font-body"
          >
            <option value="available">Available</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>
          <input
            placeholder="Image URL"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            className="border border-charcoal/20 bg-linen px-4 py-3 font-body"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border border-charcoal/20 bg-linen px-4 py-3 font-body sm:col-span-2"
            rows={3}
          />
          <div className="sm:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-ink hover:bg-forest transition-colors text-linen font-mono text-xs uppercase tracking-[0.2em] px-6 py-3 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save room"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="font-mono text-xs uppercase tracking-[0.2em] text-charcoal/50 px-6 py-3"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left font-mono text-[10px] uppercase tracking-widest text-charcoal/50 border-b border-charcoal/10">
              <th className="py-3 pr-4">Room</th>
              <th className="py-3 pr-4">Type</th>
              <th className="py-3 pr-4">Capacity</th>
              <th className="py-3 pr-4">Price</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((r) => (
              <tr key={r.id} className="border-b border-charcoal/5">
                <td className="py-3 pr-4 font-mono">{r.room_number}</td>
                <td className="py-3 pr-4">{r.room_type}</td>
                <td className="py-3 pr-4">{r.capacity}</td>
                <td className="py-3 pr-4">{formatCurrency(r.price)}</td>
                <td className="py-3 pr-4 font-mono text-[10px] uppercase tracking-widest">
                  {r.status}
                </td>
                <td className="py-3 pr-4 space-x-3 whitespace-nowrap">
                  <button
                    onClick={() => startEdit(r)}
                    className="font-mono text-[10px] uppercase tracking-widest text-brass hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="font-mono text-[10px] uppercase tracking-widest text-red-700 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
