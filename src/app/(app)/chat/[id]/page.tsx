import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import ChatBox from "../chat-box";

export const dynamic = "force-dynamic";

export default async function ThreadPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const thread = await prisma.thread.findFirst({ where: { id: params.id, userId: (session as any).userId! },
    include: { messages: true } });
  if (!thread) return <div className="p-8 text-sm text-neutral-500">Thread not found.</div>;
  return <ChatBox threadId={thread.id} initial={thread.messages.map(m => ({ role: m.role, content: m.content }))} />;
}