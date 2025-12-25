import { Providers } from "@/shared/providers/Providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Courier Connect — Book deliveries in seconds",
  description: "Customers get instant quotes and couriers keep 70% of every completed job.",
  keywords: [
    "courier",
    "delivery",
    "same day",
    "stripe connect",
    "gig work",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
