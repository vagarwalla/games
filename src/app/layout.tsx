import type { Metadata } from "next";
import { Paytone_One, Bungee, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const display = Paytone_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--ff-display",
  display: "swap",
});

const label = Bungee({
  weight: "400",
  subsets: ["latin"],
  variable: "--ff-label",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--ff-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Orient Express — Clue Lookup",
  description:
    "A fast clue lookup for Murder on the Orient Express: pick a case, an action, and a target to pull the clue.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${label.variable} ${body.variable}`}
    >
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
