import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elastic Incident Commander — Multi-Agent A2A Dashboard",
  description:
    "Real-time incident response dashboard powered by 4 AI agents using Elastic Agent Builder and A2A Protocol. Reduces MTTR from 45 minutes to under 2 minutes.",
  openGraph: {
    title: "Elastic Incident Commander",
    description: "Multi-Agent A2A Incident Response Dashboard",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface-0 text-gray-100 antialiased noise">
        {children}
      </body>
    </html>
  );
}
