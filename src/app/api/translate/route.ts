/**
 * Translation API
 * POST /api/translate - Translate text between languages
 * GET /api/translate/languages - Get supported languages
 */

import { getSupportedLanguages, translateText, translateTextMyMemory } from '@/lib/api-integrations';
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { text, targetLang, sourceLang = 'auto' } = body;

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: 'text and targetLang are required' },
        { status: 400 }
      );
    }

    // Try LibreTranslate first
    let translatedText = await translateText(text, targetLang, sourceLang);
    let service = 'LibreTranslate';

    // If translation failed or returned original, try MyMemory fallback
    if (translatedText === text && sourceLang !== targetLang) {
      translatedText = await translateTextMyMemory(
        text,
        targetLang,
        sourceLang === 'auto' ? 'en' : sourceLang
      );
      service = 'MyMemory';
    }

    return NextResponse.json({
      original: text,
      translated: translatedText,
      sourceLang,
      targetLang,
      service,
    });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const languages = await getSupportedLanguages();
    return NextResponse.json({ languages });
  } catch (error) {
    console.error('Get languages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch languages' },
      { status: 500 }
    );
  }
}
