import { auth } from '@/lib/auth';
import { chatWithGrok, GrokHelpers } from '@/lib/xai';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/ai/grok
 * Chat with Grok AI
 *
 * Body:
 * {
 *   "message": "Your question or prompt",
 *   "systemPrompt": "Optional system prompt",
 *   "action": "chat|generatePropertyDescription|analyzeMessage|searchSuggestions"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { message, systemPrompt, action, data } = body;

    if (!message && !action) {
      return NextResponse.json(
        { error: 'Message or action is required' },
        { status: 400 }
      );
    }

    let response: string | object;

    // Handle different AI actions
    switch (action) {
      case 'generatePropertyDescription':
        if (!data) {
          return NextResponse.json(
            { error: 'Property data is required' },
            { status: 400 }
          );
        }
        response = await GrokHelpers.generatePropertyDescription(data);
        break;

      case 'analyzeMessage':
        response = await GrokHelpers.analyzeMessageIntent(message);
        break;

      case 'searchSuggestions':
        response = await GrokHelpers.generateSearchSuggestions(
          message,
          data?.limit || 5
        );
        break;

      case 'chat':
      default:
        response = await chatWithGrok(message, systemPrompt);
        break;
    }

    return NextResponse.json({
      success: true,
      response,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Grok API error:', error);

    return NextResponse.json(
      {
        error: 'Failed to process AI request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai/grok
 * Get API status
 */
export async function GET() {
  const hasApiKey = !!process.env.XAI_API_KEY;

  return NextResponse.json({
    status: 'ok',
    configured: hasApiKey,
    message: hasApiKey
      ? 'XAI API is configured'
      : 'XAI_API_KEY is not set',
  });
}
