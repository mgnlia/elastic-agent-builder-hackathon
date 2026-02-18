import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Incident Commander — Elastic Agent Builder",
  description:
    "Multi-agent DevOps incident response dashboard. 4 AI agents orchestrated via A2A protocol to reduce MTTR from 45min to 5min.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-950 text-gray-100 antialiased">{children}</body>
    </html>
  );
}
