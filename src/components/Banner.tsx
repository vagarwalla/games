import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Banner({ active }: { active?: "home" | "verify" }) {
  return (
    <header
      className="safe-x sticky top-0 z-30"
      style={{
        background: "var(--teal)",
        borderBottom: "3px solid var(--ink)",
      }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-3 py-2.5 sm:px-4">
        <Link
          href="/"
          className="focusable font-display text-base leading-none tracking-wide sm:text-lg"
          style={{ color: "var(--paper)", textShadow: "2px 2px 0 var(--ink)" }}
        >
          ORIENT&nbsp;EXPRESS
        </Link>

        <div className="flex items-center gap-1.5">
          <nav className="flex items-center gap-1.5">
            <NavLink href="/" label="Lookup" active={active === "home"} />
            <NavLink href="/verify" label="Ledger" active={active === "verify"} />
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className="focusable press rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wide sm:text-sm"
      style={{
        background: active ? "var(--yellow)" : "var(--surface)",
        color: "var(--ink)",
        border: "2.5px solid var(--ink)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {label}
    </Link>
  );
}
