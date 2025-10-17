import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CollabConnect - Connect. Collaborate. Win.",
  description: "The platform that connects people to fight back against big institutions and collaborate on life's biggest challenges.",
  keywords: "collaboration, insurance claims, house buying, community, transparency",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased font-sans`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
