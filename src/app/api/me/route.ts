import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db";
import { log } from "@/lib/logs";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const userId = (session as any).userId!;
  const user = await prisma.user.findUnique({ where: { id: userId },
    select: { email: true, name: true, plan: true, preferences: true, assistant: { select: { name: true, personality: true } } } });
  const prefs = (user?.preferences ?? {}) as any;
  return NextResponse.json({ ...user, scheduling: prefs.scheduling ?? {} });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const userId = (session as any).userId!;
  const { assistant, scheduling } = await req.json();

  const prefs: any = (await prisma.user.findUnique({ where: { id: userId }, select: { preferences: true } }))?.preferences ?? {};
  if (scheduling) prefs.scheduling = scheduling;

  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { preferences: prefs } }),
    ...(assistant ? [prisma.assistant.update({ where: { userId }, data: { name: assistant.name, personality: assistant.personality } })] : []),
  ]);
  await log(userId, "system", "Settings updated");
  return NextResponse.json({ ok: true });
}
