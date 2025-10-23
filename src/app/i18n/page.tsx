
"use client";
// Multilingual support page
// Norm Macdonald style: If you want to say it in Czech, say it in Czech. If you want Vietnamese, go wild.

import { useState } from 'react';

const languages = [
  { code: 'en', name: 'English', theme: 'bg-blue-50 text-blue-900' },
  { code: 'cs', name: 'Czech', theme: 'bg-white text-blue-700' },
  { code: 'uk', name: 'Ukrainian', theme: 'bg-yellow-50 text-yellow-900' },
  { code: 'vi', name: 'Vietnamese', theme: 'bg-green-50 text-green-900' },
  { code: 'tr', name: 'Turkish', theme: 'bg-red-50 text-red-900' },
];

export default function I18nPage() {
  const [selected, setSelected] = useState('en');
  const currentLang = languages.find(l => l.code === selected) || languages[0];

  // Look, you pick a language, you get a theme. That's the deal.
  return (
    <main className={`max-w-2xl mx-auto py-8 transition-all duration-300 ${currentLang.theme}`}>
      <h1 className="text-3xl font-bold mb-4">CollabConnect: Real Connections, Real Transparency</h1>
      <p className="mb-6 text-lg">Connecting people to fight big insurance, buy homes together, and collaborate across languages. If you want to do it in Czech, go for it. If you want Vietnamese, we got you.</p>
      <div className="mb-6">
        <label htmlFor="lang" className="font-semibold mr-2">Choose your language:</label>
        <select
          id="lang"
          value={selected}
          onChange={e => setSelected(e.target.value)}
          className="border rounded px-2 py-1"
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>
      </div>
      <div className="border rounded-lg p-4 bg-white shadow">
        <p>Translation and chat in 20+ languages coming soon. We use LibreTranslate and MyMemory, because why pay Google if you don't have to?</p>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Our Mission</h2>
        <ul className="list-disc pl-6">
          <li>Connect people with real profiles, real hobbies, and real friends.</li>
          <li>Show what's real and what's not. If it's verified, you'll know.</li>
          <li>Collaborate to buy or bid for houses. No corporate nonsense.</li>
          <li>Full transparency. If we mess up, you'll see it.</li>
        </ul>
      </div>
    </main>
  );
}
