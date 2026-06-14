import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Banner({ active }: { active?: "home" | "verify" }) {
  return (
    <header
      className="sticky top-0 z-20 backdrop-blur-sm"
      style={{
        background: "color-mix(in srgb, var(--paper) 88%, transparent)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-baseline gap-3">
          <Link
            href="/"
            className="focusable font-display text-lg italic leading-none tracking-tight"
            style={{ color: "var(--amber)" }}
          >
            Orient&nbsp;Express
          </Link>
          <span className="label-kicker hidden sm:inline">Case File</span>
        </div>

        <div className="flex items-center gap-1.5">
          <nav className="mr-1 flex items-center gap-1 text-sm">
            <NavLink href="/" label="Lookup" active={active === "home"} />
            <span aria-hidden="true" style={{ color: "var(--line)" }}>
              ·
            </span>
            <NavLink href="/verify" label="Ledger" active={active === "verify"} />
          </nav>
          <ThemeToggle />
        </div>
      </div>
      <div className="rule-brass" />
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
      className="focusable rounded px-2 py-1 transition-colors"
      style={{
        color: active ? "var(--ink)" : "var(--ink-muted)",
        fontWeight: active ? 600 : 400,
        textDecoration: active ? "underline" : "none",
        textDecorationColor: "var(--amber)",
        textUnderlineOffset: "4px",
      }}
    >
      {label}
    </Link>
  );
}
