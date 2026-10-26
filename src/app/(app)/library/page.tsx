import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const session = await getServerSession(authOptions);
  const docs = await prisma.doc.findMany({ where: { userId: (session as any).userId! } });
  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold">Library</h1>
      <p className="mt-1 text-sm text-neutral-500">Documents and files your assistant has produced.</p>
      <div className="mt-6 space-y-2">
        {docs.length === 0 && <p className="text-sm text-neutral-400">Nothing yet — briefings and reports will appear here.</p>}
        {docs.map(d => <div key={d.id} className="rounded-xl border bg-white p-4 text-sm">{d.title}</div>)}
      </div>
    </div>
  );
}