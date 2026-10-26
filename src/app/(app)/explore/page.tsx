import Link from "next/link";

const LIVE = new Set(["auto-inbox", "morning-briefing", "meeting-briefing", "loose-ends"]);
const CARDS = [
  ["auto-inbox", "Auto-inbox", "Watches for new emails, labels by type, drafts replies when warranted, helps with scheduling."],
  ["morning-briefing", "Morning Briefing", "Daily email: your schedule, urgent items, updates on topics you care about."],
  ["meeting-briefing", "Meeting Briefing", "Researches upcoming meetings, emails a concise briefing, saves it as a document."],
  ["loose-ends", "Loose-Ends Sweep", "Late each weekday, sweeps mail and Slack for every open loop you owe."],
  ["decline-cold-outreach", "Decline Cold Outreach", "Detects unsolicited recruiter/sales outreach, labels it, drafts a polite decline."],
  ["schedule-optimizer", "Schedule Optimizer", "Every Sunday evening: cluster meetings, protect focus time, avoid burnout."],
  ["competitive-intel", "Competitive Intel Briefing", "Scans the web for competitor news and product launches on your schedule."],
  ["newsletter-digest", "Newsletter Digest", "Concise digest of your labeled newsletters, on your chosen schedule."],
  ["github-reports", "GitHub Reports", "Aggregates development activity — built, merged, blocked — without hunting."],
  ["relationship-reconnect", "Relationship Reconnect", "Weekly catch-up suggestions for people you value but haven't contacted."],
  ["deal-spotter", "Deal Spotter", "Scans inbound email for opportunities, logs signals, recommends next steps."],
  ["weekly-briefing", "Weekly Briefing", "Start your week knowing what's ahead."],
] as const;

export default function ExplorePage() {
  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold">Explore</h1>
      <p className="mt-1 text-sm text-neutral-500">Pre-built routines. Cards marked beta are on the roadmap.</p>
      <div className="mt-6 grid grid-cols-3 gap-4">
        {CARDS.map(([key, title, desc]) => {
          const live = LIVE.has(key);
          return <div key={key} className="rounded-xl border bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="font-medium">{title}</div>
              {!live && <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">coming soon</span>}
            </div>
            <p className="mt-2 text-sm text-neutral-600">{desc}</p>
            {live
              ? <Link href="/powers/routines" className="mt-4 inline-block rounded-lg bg-neutral-900 px-4 py-1.5 text-sm text-white">Set up</Link>
              : <button disabled className="mt-4 rounded-lg border px-4 py-1.5 text-sm text-neutral-400">Install</button>}
          </div>;
        })}
      </div>
    </div>
  );
}
