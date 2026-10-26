import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db";

const NAV = [
  ["Chat", "/chat"], ["For you", "/for-you"], ["Powers", "/powers/routines"],
  ["Explore", "/explore"], ["Wiki", "/wiki"], ["Library", "/library"], ["Pricing", "/pricing"],
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: (session as any).userId! },
    select: { creditsBalance: true, plan: true, onboardingDone: true } });
  if (user && !user.onboardingDone) redirect("/onboarding");
  return (
    <div className="flex h-screen">
      <aside className="w-56 shrink-0 border-r bg-white p-4 flex flex-col gap-1">
        <div className="mb-3 font-semibold">Ari</div>
        {NAV.map(([label, href]) => <Link key={href} href={href}
          className="rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100">{label}</Link>)}
        <div className="mt-auto rounded-xl bg-neutral-100 p-3 text-xs">
          <div className="font-medium capitalize">{user?.plan} plan</div>
          <div className="mt-1 text-neutral-600">{user?.creditsBalance.toLocaleString()} credits left</div>
          <Link href="/pricing" className="mt-2 block font-medium underline">Upgrade</Link>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
