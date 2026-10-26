"use client";
import { useState, useEffect } from "react";

type Me = { email: string; name: string; timezone: string; plan: string;
  assistant: { name: string; personality: string } | null;
  scheduling: { workingHours?: string; distribution?: string; recurring?: string } };

export default function SettingsPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetch("/api/me").then(r => r.json()).then(setMe); }, []);
  if (!me) return <div className="p-8 text-sm text-neutral-400">Loading…</div>;

  async function save(patch: Partial<Me>) {
    const next = { ...me, ...patch } as Me;
    setMe(next);
    setSaved(false);
    await fetch("/api/me", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
    setSaved(true);
  }

  const sched = me.scheduling ?? {};

  return (
    <div className="max-w-2xl p-8">
      <h1 className="text-xl font-semibold">Settings</h1>
      {saved && <p className="mt-2 text-sm text-green-600">Saved.</p>}

      <section className="mt-8">
        <h2 className="text-sm font-medium text-neutral-500">Profile</h2>
        <div className="mt-3 rounded-xl border bg-white p-5">
          <div className="text-sm text-neutral-500">{me.email}</div>
          <div className="mt-1 text-sm capitalize text-neutral-500">{me.plan} plan</div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-neutral-500">Assistant</h2>
        <div className="mt-3 space-y-3 rounded-xl border bg-white p-5">
          <label className="block text-sm">Name
            <input className="mt-1 w-full rounded-lg border p-2.5" value={me.assistant?.name ?? ""}
              onChange={e => save({ assistant: { ...(me.assistant ?? { personality: "" }), name: e.target.value, personality: me.assistant?.personality ?? "" } })} />
          </label>
          <label className="block text-sm">Personality
            <textarea className="mt-1 w-full rounded-lg border p-2.5" rows={2} value={me.assistant?.personality ?? ""}
              onChange={e => save({ assistant: { name: me.assistant?.name ?? "", personality: e.target.value } })} />
          </label>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-neutral-500">Scheduling preferences</h2>
        <div className="mt-3 space-y-3 rounded-xl border bg-white p-5">
          {([["Working hours", "workingHours", ["Weekdays · 8:00 AM – 4:00 PM", "Weekdays · 9:00 AM – 5:00 PM", "Weekdays · 10:00 AM – 6:00 PM"]],
             ["Meeting distribution", "distribution", ["Consolidate onto busier days", "Spread evenly", "Protect mornings"]],
             ["Recurring rules", "recurring", ["None", "Daily standups", "Weekly review Friday"]]] as const).map(([label, key, opts]) =>
            <label key={key} className="flex items-center justify-between text-sm">
              {label}
              <select className="rounded-lg border p-2" value={sched[key] ?? opts[1]}
                onChange={e => save({ scheduling: { ...sched, [key]: e.target.value } })}>
                {opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </label>)}
        </div>
      </section>
    </div>
  );
}
