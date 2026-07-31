"use client";

import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // Hook this up to a Supabase table + Make.com scenario, or a mailto/service of your choice.
    setSent(true);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass mb-3">
        Get in touch
      </p>
      <h1 className="font-display text-4xl text-charcoal mb-10">Contact us</h1>

      {sent ? (
        <div className="border border-charcoal/10 p-8 text-center">
          <p className="text-charcoal/70">
            Thanks — the front desk will get back to you shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              required
              placeholder="Name"
              className="border border-charcoal/20 bg-linen px-4 py-3 font-body"
            />
            <input
              required
              type="email"
              placeholder="Email"
              className="border border-charcoal/20 bg-linen px-4 py-3 font-body"
            />
          </div>
          <input
            placeholder="Subject"
            className="w-full border border-charcoal/20 bg-linen px-4 py-3 font-body"
          />
          <textarea
            required
            rows={5}
            placeholder="Message"
            className="w-full border border-charcoal/20 bg-linen px-4 py-3 font-body"
          />
          <button
            type="submit"
            className="bg-brass hover:bg-brass-light transition-colors text-ink font-mono text-xs uppercase tracking-[0.2em] px-8 py-4"
          >
            Send message
          </button>
        </form>
      )}

      <div className="mt-16 border-t border-charcoal/10 pt-10 font-mono text-sm text-charcoal/60 space-y-1">
        <p>14 Harbor Watch Lane, Port Aurelia, ME 04101</p>
        <p>samyamir705@gmail.com</p>
        <p>+212 0767-758083</p>
      </div>
    </div>
  );
}
