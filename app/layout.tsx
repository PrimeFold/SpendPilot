import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

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
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 text-white p-4 shadow-md">
          <nav className="container mx-auto flex justify-between items-center">
            <a href="/" className="text-xl font-bold">SpendPilot</a>
            {/* Add navigation links here if needed */}
          </nav>
        </header>

        {/* Main content area - grows to push footer down */}
        <main className="grow container mx-auto p-4">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white p-4 text-center text-sm">
          © {new Date().getFullYear()} SpendPilot. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
