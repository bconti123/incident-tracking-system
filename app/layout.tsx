import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Incident Tracking System",
  description: "A simple incident tracking system built with Next.js and Prisma.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
