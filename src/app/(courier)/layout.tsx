import type { ReactNode } from "react";

export default function CourierLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <>{children}</>;
}
