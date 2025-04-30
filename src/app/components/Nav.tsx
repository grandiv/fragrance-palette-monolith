import Link from "next/link";
export function Nav() {
  return (
    <nav className="space-x-4 justify-between">
      <Link href="/">Home</Link>
      <Link href="/generate">Generate</Link>
      <Link href="/my-formulas">My Formulas</Link>
      <Link href="/api/auth/signout">Sign Out</Link>
    </nav>
  );
}
