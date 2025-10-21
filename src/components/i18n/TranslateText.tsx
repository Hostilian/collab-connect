"use client";
// Multilingual translation component using LibreTranslate and MyMemory
import { useState } from "react";
import { translateText, myMemoryTranslate } from "@/lib/i18n";

interface TranslateTextProps {
  text: string;
  targetLang: string;
  sourceLang?: string;
}

export default function TranslateText({ text, targetLang, sourceLang = "en" }: TranslateTextProps) {
  const [translation, setTranslation] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await translateText(text, targetLang, sourceLang);
      setTranslation(result);
  } catch {
      setError("LibreTranslate failed, trying MyMemory...");
      try {
        const fallback = await myMemoryTranslate(text, targetLang, sourceLang);
        setTranslation(fallback);
      } catch {
        setError("Translation failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button className="px-4 py-1 bg-blue-600 text-white rounded" onClick={handleTranslate} disabled={loading}>
        Translate
      </button>
      {loading && <div>Translating...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {translation && (
        <div className="mt-2 p-2 bg-gray-100 rounded">{translation}</div>
      )}
    </div>
  );
}
