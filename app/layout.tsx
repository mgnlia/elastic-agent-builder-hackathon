import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Elastic Incident Commander — Multi-Agent A2A Incident Response",
  description:
    "AI-powered incident response using 4 coordinated agents with Elastic's ES|QL and A2A protocol. Built for the Elastic Agent Builder Hackathon.",
  openGraph: {
    title: "Elastic Incident Commander",
    description: "Multi-Agent A2A Incident Response — 95.7% MTTR Reduction",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-slate-950 text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
