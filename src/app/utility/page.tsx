// Visual and utility APIs page
// Norm Macdonald style: If you want a QR code, here's a QR code. If you want a news feed, here's the news.
import React from 'react';

export default function UtilityPage() {
  return (
    <main className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Visual & Utility APIs</h1>
      {/* TODO: Integrate Unsplash, QR Code Generator, IPify, News API, JSONPlaceholder, Mocki.io */}
      <div className="border rounded-lg p-4 bg-white shadow">
        <p>Images, QR codes, news, and more. (Feature coming soon!)</p>
      </div>
    </main>
  );
}
