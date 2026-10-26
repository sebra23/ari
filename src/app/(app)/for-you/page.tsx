export default function ForYouPage() {
  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold">For you</h1>
      <p className="mt-1 text-sm text-neutral-500">Task and routine suggestions from your assistant.</p>
      <div className="mt-6 space-y-3">
        <div className="rounded-xl border bg-white p-5">
          <div className="font-medium">Set up a routine once, and it keeps running for you</div>
          <p className="mt-1 text-sm text-neutral-600">Morning inbox triage that surfaces only mail needing your reply. Enable it in Powers → Routines.</p>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <div className="font-medium">Or hand off some work and it gets started</div>
          <p className="mt-1 text-sm text-neutral-600">Open a chat thread and describe the task — your assistant drafts, never sends, until you approve.</p>
        </div>
      </div>
    </div>
  );
}
