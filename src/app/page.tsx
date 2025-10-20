// Well, here we go. The main app page. If this doesn't work, it's probably my fault.
import { Suspense } from 'react';
import LocaleRouter from './[locale]/LocaleRouter';

export default function Home() {
  // Look, we want to show the locale router. If the user's lost, that's on them.
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LocaleRouter />
    </Suspense>
  );
}
