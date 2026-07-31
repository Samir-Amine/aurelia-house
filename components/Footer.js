import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink text-linen/70 border-t border-brass/20">
      <div className="max-w-6xl mx-auto px-6 py-16 grid gap-10 md:grid-cols-3">
        <div>
          <div className="font-display text-2xl text-linen mb-3">Aurelia House</div>
          <p className="text-sm leading-relaxed max-w-xs">
            A quiet harbor-side retreat of nineteen rooms, built for travelers
            who read the tide table before the newspaper.
          </p>
        </div>
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-brass mb-4">
            Navigate
          </div>
          <ul className="space-y-2 text-sm">
            <li><Link href="/rooms" className="hover:text-brass">Rooms</Link></li>
            <li><Link href="/booking" className="hover:text-brass">Reserve a stay</Link></li>
            <li><Link href="/contact" className="hover:text-brass">Contact</Link></li>
            <li><Link href="/login" className="hover:text-brass">Guest sign in</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-brass mb-4">
            Visit
          </div>
          <p className="text-sm leading-relaxed">
            14 Harbor Watch Lane<br />
            Port Aurelia, ME 04101<br />
            reservations@aureliahouse.com<br />
            +1 (207) 555-0142
          </p>
        </div>
      </div>
      <div className="border-t border-brass/10 py-6 text-center text-xs font-mono tracking-wide text-linen/40">
        © {new Date().getFullYear()} Aurelia House. All rights reserved.
      </div>
    </footer>
  );
}
