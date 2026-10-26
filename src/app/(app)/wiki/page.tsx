import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export const dynamic = "force-dynamic";

export default async function WikiPage() {
  const session = await getServerSession(authOptions);
  const pages = await prisma.wikiPage.findMany({ where: { userId: (session as any).userId! } });
  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold">Wiki</h1>
      <p className="mt-1 text-sm text-neutral-500">Your personal wiki, maintained by your assistant.</p>
      <div className="mt-6 space-y-4">
        {pages.map(p => <article key={p.id} className="rounded-xl border bg-white p-5">
          <h2 className="font-medium">{p.title}</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-700">{p.content}</p>
        </article>)}
      </div>
    </div>
  );
}