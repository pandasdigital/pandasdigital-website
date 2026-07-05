import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pandas Digital — Build. Innovate. Grow.",
  description:
    "Websites, mobile apps, custom software, SaaS platforms and AI automation built in Sri Lanka.",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

// "dev": "next dev --turbopack",
// "build": "next build",
// "start": "next start",
// "lint": "next lint",
// "postinstall": "prisma generate",
// "db:push": "prisma db push",
// "db:studio": "prisma studio",
// "db:generate": "prisma generate"
