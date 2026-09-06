import type { Metadata, Viewport } from "next";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
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
  themeColor: "#f1efe9",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
