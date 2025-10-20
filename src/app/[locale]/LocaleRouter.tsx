// This thing figures out what language the user wants. If it gets it wrong, blame the internet.
import { useRouter } from 'next/router';

const supportedLocales = ['en', 'cs', 'tr', 'uk', 'vi'];

export default function LocaleRouter() {
  const { locale } = useRouter();
  // If the locale's not supported, just go with English. We're not Google.
  const lang = locale && supportedLocales.includes(locale) ? locale : 'en';
  return <div>Current language: {lang}</div>;
}
