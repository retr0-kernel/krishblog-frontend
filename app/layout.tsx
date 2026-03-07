import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/shared/providers";

export const metadata: Metadata = {
  title: { default: "Krish Blog", template: "%s · Krish Blog" },
  description: "A personal chronicle of ideas, code, and stories.",
  openGraph: { type: "website", locale: "en_US", url: process.env.NEXT_PUBLIC_SITE_URL, siteName: "Krish Blog" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
            href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
            rel="stylesheet"
        />
      </head>
      <body>
      <Providers>{children}</Providers>
      </body>
      </html>
  );
}
