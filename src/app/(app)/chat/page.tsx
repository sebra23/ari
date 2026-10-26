import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import Link from "next/link";
import ChatBox from "./chat-box";

export const dynamic = "force-dynamic";

export default async function ChatList() {
  const session = await getServerSession(authOptions);
  const threads = await prisma.thread.findMany({ where: { userId: (session as any).userId! },
    orderBy: { createdAt: "desc" }, take: 30 });
  return (
    <div className="flex h-full">
      <div className="w-64 shrink-0 border-r bg-white p-3">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium">Recents</span>
          <Link href="/chat/new" className="rounded-lg bg-neutral-900 px-2 py-1 text-xs text-white">+ New</Link>
        </div>
        {threads.map(t => <Link key={t.id} href={`/chat/${t.id}`}
          className="block truncate rounded-lg px-2 py-1.5 text-sm hover:bg-neutral-100">{t.title}</Link>)}
      </div>
      <ChatBox threadId={null} initial={[]} />
    </div>
  );
}