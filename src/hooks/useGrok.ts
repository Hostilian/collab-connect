import { useState } from 'react';

interface GrokOptions {
  systemPrompt?: string;
  action?: 'chat' | 'generatePropertyDescription' | 'analyzeMessage' | 'searchSuggestions';
  data?: unknown;
}

interface GrokResponse {
  success: boolean;
  response: string | object;
  timestamp: string;
}

/**
 * React hook for using Grok AI
 */
export function useGrok() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chat = async (
    message: string,
    options: GrokOptions = {}
  ): Promise<string | object | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/grok', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          ...options,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to chat with Grok');
      }

      const data: GrokResponse = await response.json();
      return data.response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generatePropertyDescription = async (propertyData: {
    title: string;
    location: string;
    price: number;
    bedrooms?: number;
    bathrooms?: number;
    squareFeet?: number;
  }): Promise<string | null> => {
    const response = await chat('', {
      action: 'generatePropertyDescription',
      data: propertyData,
    });
    return typeof response === 'string' ? response : null;
  };

  const analyzeMessage = async (message: string): Promise<{
    intent: string;
    sentiment: string;
    urgency: string;
  } | null> => {
    const response = await chat(message, {
      action: 'analyzeMessage',
    });
    return typeof response === 'object' ? response as any : null;
  };

  const getSearchSuggestions = async (
    query: string,
    limit = 5
  ): Promise<string[] | null> => {
    const response = await chat(query, {
      action: 'searchSuggestions',
      data: { limit },
    });
    return Array.isArray(response) ? response : null;
  };

  return {
    chat,
    generatePropertyDescription,
    analyzeMessage,
    getSearchSuggestions,
    loading,
    error,
  };
}
