import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import CampoBusca from "@/components/CampoBusca";
import Rodape from "@/components/Rodape";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Filmes no Streaming",
  description: "Catálogo de filmes disponíveis agora nos streamings do Brasil",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 font-sans text-zinc-100">
        <header className="border-b border-zinc-800">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="text-lg font-bold">
              🎬 Filmes no Streaming
            </Link>
            <CampoBusca />
          </div>
        </header>
        {children}
        <Rodape />
      </body>
    </html>
  );
}
