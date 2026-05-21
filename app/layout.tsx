import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpendPilot",
  description: "Audit Your AI Spend in 60 Seconds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased", geistMono.variable)}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-950 font-mono">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white">
          <nav className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-10 h-14 flex items-center justify-between">
            <a
              href="/"
              className="text-xs uppercase tracking-[0.3em] text-slate-700 hover:text-slate-950 transition-colors"
            >
              SpendPilot
            </a>
            <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
              v0.1 · Demo
            </span>
          </nav>
        </header>

        {/* Main */}
        <main className="grow">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-10 h-12 flex items-center justify-between text-slate-500">
            <span className="text-[10px] uppercase tracking-[0.3em]">
              © {new Date().getFullYear()} SpendPilot
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em]">
              All rights reserved
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}