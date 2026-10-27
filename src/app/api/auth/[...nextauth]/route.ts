import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db";

// Diagnostic: capture NextAuth errors into AppLog so they can be read without
// platform log access. Remove after the OAuth issue is resolved.
async function capture(code: string, metadata: any) {
  try {
    const sys = await prisma.user.upsert({
      where: { email: "auth-log@ari.local" },
      update: {},
      create: { email: "auth-log@ari.local", name: "AuthLog", onboardingDone: true },
    });
    const err = metadata?.error ?? metadata;
    const detail = (err?.stack ?? err?.message ?? JSON.stringify(metadata) ?? String(metadata)) as string;
    await prisma.appLog.create({
      data: { userId: sys.id, source: "system", message: `[auth] ${code}: ${detail}`.slice(0, 900) },
    });
  } catch { /* diagnostics must never break auth */ }
}

const handler = NextAuth({
  ...authOptions,
  logger: {
    error: (code, metadata) => { console.error(code, metadata); void capture(code, metadata); },
    warn: (code, metadata) => { console.warn(code, metadata); void capture(`warn:${code}`, metadata); },
  },
});

export { handler as GET, handler as POST };
