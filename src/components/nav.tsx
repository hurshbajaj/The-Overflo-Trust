import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { signOutAction } from "@/lib/actions";

export async function NavBar() {
  const user = await getCurrentUser();
  return (
    <header className="border-b border-amber-900/20 bg-[#1f130f]/95 text-amber-50 backdrop-blur">
      <div className="nav-shell mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl tracking-wide">
          The Overflo&apos; Trust
        </Link>
        <nav className="nav-links flex items-center gap-5 text-sm">
          <Link href="/about">About</Link>
          <Link href="/feed">Feed</Link>
          <Link href="/leaderboard">Leaderboard</Link>
          <Link href="/lucky">I&apos;m Feeling Lucky</Link>
          {user?.role === "STEWARD" && <Link href="/dashboard">Dashboard</Link>}
          {user ? (
            <form action={signOutAction}>
              <button className="rounded-full border border-amber-200/30 px-3 py-1">Sign Out</button>
            </form>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/signup" className="rounded-full bg-amber-200 px-3 py-1 text-[#1f130f]">
                Join
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
