import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/nav";

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Overflo' Trust",
  description: "Food redistribution, civic reputation, and dignified community impact.",
  icons: {
    icon: "/logo_logo.png",
    shortcut: "/logo_logo.png",
    apple: "/logo_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="min-h-full text-[#231713]">
        <div className="relative z-10">
          <NavBar />
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
