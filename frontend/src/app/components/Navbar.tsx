// app/components/Navbar.tsx
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="p-4 flex justify-between items-center bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-xl font-bold">
          Home
        </Link>
        <SignedIn>
          <Link href="/protected" className="text-blue-500">
            Protected Page
          </Link>
        </SignedIn>
      </div>

      <div>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-4 py-2 rounded bg-blue-500 text-white">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </nav>
  );
}
