# 🤖 XAI Grok - Quick Reference

## ✅ **Status: CONFIGURED & READY**

---

## 🚀 **Quick Start (Copy & Paste)**

### **1. Use in a React Component**

```tsx
'use client';
import { useGrok } from '@/hooks/useGrok';
import { useState } from 'react';

export default function MyPage() {
  const [response, setResponse] = useState('');
  const { chat, loading } = useGrok();

  const askGrok = async () => {
    const result = await chat('Tell me about real estate investing');
    setResponse(String(result));
  };

  return (
    <div className="p-8">
      <button 
        onClick={askGrok}
        disabled={loading}
        className="px-6 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? 'Thinking...' : 'Ask Grok'}
      </button>
      {response && <p className="mt-4">{response}</p>}
    </div>
  );
}
```

### **2. Use Pre-built Chat UI**

```tsx
import { GrokChat } from '@/components/ai/GrokChat';

export default function ChatPage() {
  return <GrokChat />;
}
```

### **3. Generate Property Description**

```tsx
import { useGrok } from '@/hooks/useGrok';

export default function PropertyForm() {
  const { generatePropertyDescription, loading } = useGrok();

  const generate = async () => {
    const desc = await generatePropertyDescription({
      title: 'Luxury Penthouse',
      location: 'Manhattan, NY',
      price: 2500000,
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 2800
    });
    console.log(desc);
  };

  return <button onClick={generate}>Generate AI Description</button>;
}
```

---

## 📁 **Files You Can Use**

| File | Purpose | Import |
|------|---------|--------|
| `src/lib/xai.ts` | Core library | `import { chatWithGrok } from '@/lib/xai'` |
| `src/hooks/useGrok.ts` | React hook | `import { useGrok } from '@/hooks/useGrok'` |
| `src/components/ai/GrokChat.tsx` | UI components | `import { GrokChat } from '@/components/ai/GrokChat'` |
| `/api/ai/grok` | API endpoint | `fetch('/api/ai/grok', {...})` |

---

## 🎯 **useGrok() Hook Methods**

```tsx
const {
  chat,                           // General chat
  generatePropertyDescription,    // Property descriptions
  analyzeMessage,                // Sentiment analysis
  getSearchSuggestions,          // Search autocomplete
  loading,                        // Loading state
  error                          // Error message
} = useGrok();
```

---

## 🔌 **API Endpoint**

```bash
POST /api/ai/grok
```

**Request:**
```json
{
  "message": "Your question",
  "systemPrompt": "Optional context",
  "action": "chat|generatePropertyDescription|analyzeMessage|searchSuggestions"
}
```

**Response:**
```json
{
  "success": true,
  "response": "AI response here",
  "timestamp": "2025-10-19T10:00:00.000Z"
}
```

---

## 🎨 **Example Pages You Can Create**

### **AI Chat Assistant**
```tsx
// app/ai-chat/page.tsx
import { GrokChat } from '@/components/ai/GrokChat';

export default function Page() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">AI Assistant</h1>
      <GrokChat />
    </div>
  );
}
```

### **Smart Property Creator**
```tsx
// app/create-listing/page.tsx
import { PropertyDescriptionGenerator } from '@/components/ai/GrokChat';

export default function Page() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Create Listing with AI</h1>
      <PropertyDescriptionGenerator />
    </div>
  );
}
```

---

## 🔥 **Cool Features to Build**

1. **AI Property Descriptions** - Auto-generate compelling listings
2. **Smart Search** - Natural language property search
3. **Message Analysis** - Detect urgent/important messages
4. **Document Summarizer** - Summarize contracts & documents
5. **Market Insights** - Ask questions about real estate trends
6. **Virtual Assistant** - Help users navigate your platform
7. **Price Suggester** - AI-powered price recommendations
8. **SEO Content** - Generate meta descriptions & tags

---

## ⚡ **Performance Tips**

```tsx
// ✅ Good - Specific prompts
const response = await chat(
  'Generate a 100-word property description for a 3-bedroom apartment in Manhattan',
  { systemPrompt: 'You are a real estate copywriter.' }
);

// ❌ Bad - Vague prompts
const response = await chat('Tell me about houses');
```

---

## 🔒 **Security**

✅ API key is **server-side only**  
✅ All endpoints require **authentication**  
✅ **Never** expose API key to client  
✅ User must be logged in to use Grok  

---

## 📊 **Testing**

```bash
# Test API status
curl http://localhost:3000/api/ai/grok

# Test in browser console (must be logged in)
fetch('/api/ai/grok', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Hello!', action: 'chat' })
}).then(r => r.json()).then(console.log);
```

---

## 🚀 **Deploy to Production**

1. Go to Vercel project settings
2. Add environment variable:
   - **Name:** `XAI_API_KEY`
  - **Value:** `<your-xai-api-key>`
3. Redeploy

---

## 📚 **Full Documentation**

See `XAI_GROK_SETUP.md` for complete details.

---

## 🎉 **You're All Set!**

Your XAI Grok integration is ready to use!

**Try it:**
1. Start dev: `npm run dev`
2. Add `<GrokChat />` to any page
3. Start chatting with Grok!

**API Key:** ✅ Configured  
**Endpoints:** ✅ Working  
**Components:** ✅ Ready to use  
**Documentation:** ✅ Complete  

---

**Happy coding with Grok! 🚀**
