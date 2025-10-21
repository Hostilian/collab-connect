// Multilingual support page
// Norm Macdonald style: If you want to say it in Czech, say it in Czech. If you want Vietnamese, go wild.
import React from 'react';

export default function I18nPage() {
  return (
    <main className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Multilingual Support</h1>
      {/* TODO: Integrate LibreTranslate, MyMemory, Google Translate APIs */}
      <div className="border rounded-lg p-4 bg-white shadow">
        <p>Translate and chat in 20+ languages. (Feature coming soon!)</p>
      </div>
    </main>
  );
}
