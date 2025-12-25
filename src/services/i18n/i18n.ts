// Multilingual support using LibreTranslate and MyMemory
// If you can't read this, maybe the translation API can help.

export async function translateText(text: string, targetLang: string, sourceLang: string = 'en') {
  // LibreTranslate API
  const url = 'https://libretranslate.com/translate';
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: text, source: sourceLang, target: targetLang, format: 'text' }),
  });
  const data = await res.json();
  return data.translatedText;
}

export async function myMemoryTranslate(text: string, targetLang: string, sourceLang: string = 'en') {
  // MyMemory API
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.responseData.translatedText;
}
