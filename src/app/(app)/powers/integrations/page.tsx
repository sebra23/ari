const INTEGRATIONS = [
  ["Google", "Gmail, Calendar, Drive, Docs, Sheets", true],
  ["Microsoft 365", "Outlook, Calendar, OneDrive, Teams", true],
  ["Slack", "Persona + bot — chat with your assistant", false],
  ["GitHub", "Repos, issues, pull requests", false],
  ["Notion", "Pages and databases", false],
  ["HubSpot", "CRM contacts and deals", false],
  ["Calendly", "Availability and bookings", false],
  ["Linear", "Issues and sprints", false],
  ["Asana", "Tasks and projects", false],
  ["Dropbox", "Files", false],
  ["Zoom", "Meetings and recordings", false],
  ["Salesforce", "Records and activity", false],
] as const;

export default function IntegrationsPage() {
  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold">Integrations</h1>
      <p className="mt-1 text-sm text-neutral-500">Connect the tools where your work already happens.</p>
      <div className="mt-6 grid grid-cols-3 gap-4">
        {INTEGRATIONS.map(([name, desc, live]) => <div key={name} className="rounded-xl border bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="font-medium">{name}</div>
            {live
              ? <button className="rounded-lg bg-neutral-900 px-3 py-1 text-xs text-white">Connect</button>
              : <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">coming soon</span>}
          </div>
          <p className="mt-1 text-sm text-neutral-600">{desc}</p>
        </div>)}
      </div>
    </div>
  );
}
