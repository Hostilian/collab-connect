import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

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
      <body className="antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
