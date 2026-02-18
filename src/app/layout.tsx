import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Incident Commander — Elastic Agent Builder",
  description:
    "Multi-agent DevOps incident response powered by Elastic Agent Builder and A2A Protocol. 4 specialized agents collaborate to reduce MTTR from 45 minutes to under 2 minutes.",
  openGraph: {
    title: "Incident Commander",
    description: "Multi-agent DevOps incident response — Elastic Agent Builder Hackathon 2026",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
