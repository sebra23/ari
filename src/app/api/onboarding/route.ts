import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { bootstrapWiki } from "@/lib/wiki/bootstrap";
import { log } from "@/lib/logs";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const userId = (session as any).userId;
  const { routines, assistant, preferences } = await req.json();

  await prisma.$transaction([
    ...Object.entries(routines as Record<string, boolean>).map(([key, enabled]) =>
      prisma.routine.upsert({ where: { userId_key: { userId, key } },
        update: { enabled }, create: { userId, key, enabled } })),
    prisma.assistant.upsert({ where: { userId },
      update: { name: assistant.name, personality: assistant.personality, voiceName: assistant.voice },
      create: { userId, name: assistant.name || "Assistant",
        slug: `${(assistant.name || "assistant").toLowerCase().replace(/\s+/g, "")}-${userId.slice(-6)}`,
        personality: assistant.personality, voiceName: assistant.voice } }),
    prisma.user.update({ where: { id: userId }, data: { onboardingDone: true, preferences: preferences ?? {} } }),
  ]);
  await log(userId, "system", "Onboarding completed");
  await bootstrapWiki(userId, session.user?.name ?? "there");
  return NextResponse.json({ ok: true });
}