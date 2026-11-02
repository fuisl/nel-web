import type { Metadata, Viewport } from "next";
import "@fontsource/inter-tight/400.css";
import "@fontsource/inter-tight/500.css";
import "@fontsource/inter-tight/600.css";
import "@fontsource/reenie-beanie/400.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEL — Photographer in Ho Chi Minh City",
  description:
    "Wedding, portrait, editorial, and event photography by NEL in Ho Chi Minh City, Vietnam.",
  metadataBase: new URL("https://nel-web-tan.vercel.app"),
  openGraph: {
    title: "NEL — Photography",
    description: "Honest images for people, stories, and brands.",
    type: "website",
    images: ["/images/hero-wedding-2512.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
