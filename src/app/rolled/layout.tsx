import type { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Rolled — Find Secondhand Board Game Deals",
  description:
    "Build stacks of board games you want and find the best secondhand deals on eBay.",
};

/*
 * Rolled keeps its own palette. The tokens live under `.rolled` in globals.css
 * rather than :root, so the navy/amber scheme cannot leak into Orient Express
 * — the two games sit in one app but share nothing except the theme class that
 * next-themes puts on <html>.
 */
export default function RolledLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="rolled">
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            color: "var(--text)",
          },
        }}
      />
    </div>
  );
}
