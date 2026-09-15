import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PromptVault - AI Workflow & Prompt Manager",
  description: "Kelola, filter, dan salin prompt AI dengan variabel dinamis secara cepat & terstruktur.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className="antialiased bg-zinc-950 text-zinc-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
