/**
 * XAI (Grok) API Integration
 * @see https://docs.x.ai/
 */

interface XAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface XAIRequest {
  model: string;
  messages: XAIMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

interface XAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: XAIMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Get XAI client configuration
 */
function getXAIConfig() {
  const apiKey = process.env.XAI_API_KEY;

  if (!apiKey) {
    throw new Error('XAI_API_KEY is not configured');
  }

  return {
    apiKey,
    baseURL: 'https://api.x.ai/v1',
  };
}

/**
 * Call XAI (Grok) API
 */
export async function callGrok(
  messages: XAIMessage[],
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<string> {
  const config = getXAIConfig();

  const request: XAIRequest = {
    model: options.model || 'grok-beta',
    messages,
    temperature: options.temperature || 0.7,
    max_tokens: options.maxTokens || 1000,
  };

  const response = await fetch(`${config.baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`XAI API error: ${response.status} - ${error}`);
  }

  const data: XAIResponse = await response.json();

  return data.choices[0]?.message?.content || '';
}

/**
 * Simple chat interface for Grok
 */
export async function chatWithGrok(
  userMessage: string,
  systemPrompt?: string
): Promise<string> {
  const messages: XAIMessage[] = [];

  if (systemPrompt) {
    messages.push({
      role: 'system',
      content: systemPrompt,
    });
  }

  messages.push({
    role: 'user',
    content: userMessage,
  });

  return callGrok(messages);
}

/**
 * Example usage for CollabConnect features
 */
export const GrokHelpers = {
  /**
   * Generate property description from details
   */
  async generatePropertyDescription(propertyData: {
    title: string;
    location: string;
    price: number;
    bedrooms?: number;
    bathrooms?: number;
    squareFeet?: number;
  }): Promise<string> {
    const prompt = `Generate a compelling property listing description for:
Title: ${propertyData.title}
Location: ${propertyData.location}
Price: $${propertyData.price.toLocaleString()}
${propertyData.bedrooms ? `Bedrooms: ${propertyData.bedrooms}` : ''}
${propertyData.bathrooms ? `Bathrooms: ${propertyData.bathrooms}` : ''}
${propertyData.squareFeet ? `Size: ${propertyData.squareFeet} sq ft` : ''}

Write a professional, engaging description in 2-3 paragraphs.`;

    return chatWithGrok(
      prompt,
      'You are a professional real estate copywriter who creates compelling property descriptions.'
    );
  },

  /**
   * Analyze user message for intent
   */
  async analyzeMessageIntent(message: string): Promise<{
    intent: 'question' | 'request' | 'complaint' | 'feedback' | 'other';
    sentiment: 'positive' | 'neutral' | 'negative';
    urgency: 'low' | 'medium' | 'high';
  }> {
    const prompt = `Analyze this user message and respond with JSON:
Message: "${message}"

Respond with only a JSON object in this format:
{
  "intent": "question|request|complaint|feedback|other",
  "sentiment": "positive|neutral|negative",
  "urgency": "low|medium|high"
}`;

    const response = await chatWithGrok(
      prompt,
      'You are a message analysis assistant. Respond only with valid JSON.'
    );

    try {
      return JSON.parse(response);
    } catch {
      return {
        intent: 'other',
        sentiment: 'neutral',
        urgency: 'medium',
      };
    }
  },

  /**
   * Generate smart search suggestions
   */
  async generateSearchSuggestions(query: string, limit = 5): Promise<string[]> {
    const prompt = `Given this property search query: "${query}"

Generate ${limit} related search suggestions that users might be interested in.
Respond with only the suggestions, one per line, without numbering.`;

    const response = await chatWithGrok(
      prompt,
      'You are a real estate search assistant.'
    );

    return response
      .split('\n')
      .filter(line => line.trim())
      .slice(0, limit);
  },
};

/**
 * Export type for use in API routes
 */
export type { XAIMessage };

