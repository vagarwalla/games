import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Banner({ active }: { active?: "home" | "verify" }) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-black/10 px-4 py-3 dark:border-white/15">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-base font-semibold">
          🚂 Orient Express
        </Link>
        <nav className="flex gap-3 text-sm">
          <Link
            href="/"
            className={active === "home" ? "font-semibold" : "opacity-70"}
          >
            Lookup
          </Link>
          <Link
            href="/verify"
            className={active === "verify" ? "font-semibold" : "opacity-70"}
          >
            Verify
          </Link>
        </nav>
      </div>
      <ThemeToggle />
    </header>
  );
}
