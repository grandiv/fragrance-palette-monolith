import Link from "next/link";
import { Button } from "@/components/ui/button";
export function Nav() {
  return (
    <nav className="flex items-center space-x-4">
      <Link href="/" passHref>
        <Button variant="ghost" asChild>
          <div>Home</div>
        </Button>
      </Link>
      <Link href="/generate" passHref>
        <Button variant="ghost" asChild>
          <div>Generate</div>
        </Button>
      </Link>
      <Link href="/my-formulas" passHref>
        <Button variant="ghost" asChild>
          <div>My Formulas</div>
        </Button>
      </Link>
      <Link href="/api/auth/signout" passHref>
        <Button variant="ghost" asChild>
          <div>Sign Out</div>
        </Button>
      </Link>
    </nav>
  );
}
