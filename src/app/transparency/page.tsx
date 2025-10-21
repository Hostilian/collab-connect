// Data transparency page
// Norm Macdonald style: If you want to see who's real, here's the dirt. If you want to see the company, here's the paperwork.
import React from 'react';

export default function TransparencyPage() {
  return (
    <main className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Transparency & Verification</h1>
      {/* TODO: Integrate OpenCorporates, Open Data Portal EU, GOV.UK, Clearbit APIs */}
      <div className="border rounded-lg p-4 bg-white shadow">
        <p>See company, property, and collaboration data. (Feature coming soon!)</p>
      </div>
    </main>
  );
}
