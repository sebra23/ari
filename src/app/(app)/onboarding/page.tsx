"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTINES } from "./routines-data";

const STEPS = ["Welcome", "Routines", "Your profile", "Apps", "Scheduling", "Assistant"];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [routines, setRoutines] = useState<Record<string, boolean>>({});
  const [assistant, setAssistant] = useState({ name: "", personality: "Minimal, high-signal, and brief.", avatar: "column" });
  const router = useRouter();

  async function finish() {
    await fetch("/api/onboarding", { method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ routines, assistant }) });
    router.push("/chat");
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <div className="mb-6 flex gap-1">{STEPS.map((s, i) => <div key={s} className={"h-1 flex-1 rounded " + (i <= step ? "bg-neutral-800" : "bg-neutral-200")} />)}</div>
      <h1 className="text-2xl font-semibold">{STEPS[step]}</h1>

      {step === 0 && <ul className="mt-6 space-y-3 text-neutral-700">
        <li>Learn the basics from your email and calendar</li>
        <li>Choose routines that run in the background</li>
        <li>Connect extra apps and personalize your assistant</li>
        <li>It <u>never</u> sends emails or messages without your approval</li>
      </ul>}

      {step === 1 && <div className="mt-6 space-y-4">
        {ROUTINES.map(r => <label key={r.key} className="flex items-center justify-between rounded-xl border p-4">
          <span><b>{r.title}</b><br /><span className="text-sm text-neutral-600">{r.desc}</span></span>
          <input type="checkbox" className="h-5 w-9 accent-neutral-900"
            checked={!!routines[r.key]}
            onChange={e => setRoutines({ ...routines, [r.key]: e.target.checked })} />
        </label>)}
      </div>}

      {step === 5 && <div className="mt-6 space-y-4">
        <input className="w-full rounded-lg border p-3" placeholder="Name your assistant…"
          value={assistant.name} onChange={e => setAssistant({ ...assistant, name: e.target.value })} />
        <textarea className="w-full rounded-lg border p-3" rows={2}
          value={assistant.personality} onChange={e => setAssistant({ ...assistant, personality: e.target.value })} />
        <p className="text-sm text-neutral-500">{(assistant.name || "assistant").toLowerCase().replace(/\s+/g, "")}@ari.app — only you can trigger it by emailing this address.</p>
      </div>}

      <div className="mt-8 flex justify-between">
        {step > 0 && <button onClick={() => setStep(step - 1)}>Back</button>}
        {step < STEPS.length - 1
          ? <button className="rounded-lg bg-neutral-900 px-6 py-2.5 text-white" onClick={() => setStep(step + 1)}>Continue</button>
          : <button className="rounded-lg bg-neutral-900 px-6 py-2.5 text-white" onClick={finish}>Finish setup</button>}
      </div>
    </main>
  );
}
