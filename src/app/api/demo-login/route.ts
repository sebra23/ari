import { encode } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (process.env.NEXT_PUBLIC_DEMO !== "1") return NextResponse.redirect(new URL("/login", req.url));
  let demo = await prisma.user.findUnique({ where: { email: "demo@ari.local" } });
  if (!demo) {
    demo = await prisma.user.create({ data: { email: "demo@ari.local", name: "Demo User",
      onboardingDone: true, plan: "pro", creditsBalance: 5000 } });
    await prisma.assistant.create({ data: { userId: demo.id, name: "Column",
      slug: "column-demo", personality: "Minimal, high-signal, and brief." } });
  }
  const token = await encode({ token: { sub: demo.id, email: demo.email, name: demo.name },
    secret: process.env.NEXTAUTH_SECRET!, maxAge: 30 * 24 * 3600 });
  const res = NextResponse.redirect(new URL("/chat", req.url));
  res.cookies.set("next-auth.session-token", token, { httpOnly: true, sameSite: "lax", path: "/" });
  return res;
}