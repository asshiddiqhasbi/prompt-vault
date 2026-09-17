import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PromptVault - Universal AI Prompt & Workflow Manager",
  description: "Simpan, kustomisasi variabel dinamis, dan salin template prompt AI favoritmu dalam 1-klik untuk produktivitas harian.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className="antialiased bg-zinc-950 text-zinc-100 min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
