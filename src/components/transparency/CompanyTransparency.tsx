"use client";
// Company transparency component using OpenCorporates, EU Data Portal, GOV.UK, and Clearbit
import { getCompanyData, getEUTransparencyData } from "@/lib/transparency";
import { useState } from "react";

interface CompanyTransparencyProps {
  companyName: string;
  jurisdiction?: string;
}

export default function CompanyTransparency({ companyName, jurisdiction }: CompanyTransparencyProps) {
  const [data, setData] = useState<object | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCompanyData(companyName, jurisdiction);
      setData(result);
  } catch {
      setError("OpenCorporates failed, trying EU Data Portal...");
      try {
        const fallback = await getEUTransparencyData(companyName);
        setData(fallback);
      } catch {
        setError("Transparency lookup failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button className="px-4 py-1 bg-green-600 text-white rounded" onClick={handleLookup} disabled={loading}>
        Lookup Company
      </button>
      {loading && <div>Looking up...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {data && (
        <div className="mt-2 p-2 bg-gray-100 rounded">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
