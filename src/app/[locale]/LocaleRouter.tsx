
"use client";
// This thing figures out what language the user wants. If it gets it wrong, blame the internet.
import { usePathname } from 'next/navigation';

const supportedLocales = ['en', 'cs', 'tr', 'uk', 'vi'];

export default function LocaleRouter() {
  const pathname = usePathname();
  // Parse locale from pathname (e.g., /en, /cs, etc.)
  const locale = supportedLocales.find(loc => pathname.startsWith(`/${loc}`)) || 'en';
  return <div>Current language: {locale}</div>;
}
