# 🤖 XAI (Grok) Integration - Complete Setup

## ✅ **CONFIGURED!**

Your XAI API key has been successfully added to CollabConnect.

---

## 🔑 Configuration

### **Environment Variable Added:**

```env
XAI_API_KEY="<your-xai-api-key>"
```

**Files Updated:**
- ✅ `.env` - Added XAI_API_KEY with your key
- ✅ `.env.example` - Added template for other developers

---

## 📁 Files Created

### **1. Core Library: `src/lib/xai.ts`**
- `callGrok()` - Low-level API wrapper
- `chatWithGrok()` - Simple chat interface
- `GrokHelpers` - Pre-built helper functions:
  - `generatePropertyDescription()` - AI property listings
  - `analyzeMessageIntent()` - Intent detection & sentiment
  - `generateSearchSuggestions()` - Smart search autocomplete

### **2. API Route: `src/app/api/ai/grok/route.ts`**
- **POST** `/api/ai/grok` - Chat with Grok
- **GET** `/api/ai/grok` - Check API status
- Supports multiple actions:
  - `chat` - General conversation
  - `generatePropertyDescription` - Property descriptions
  - `analyzeMessage` - Message analysis
  - `searchSuggestions` - Search suggestions

### **3. React Hook: `src/hooks/useGrok.ts`**
- `useGrok()` - Easy-to-use React hook
- Automatic loading states
- Error handling built-in
- Multiple helper methods

### **4. UI Components: `src/components/ai/GrokChat.tsx`**
- `<GrokChat />` - Full chat interface
- `<PropertyDescriptionGenerator />` - Property description tool

---

## 🚀 Usage Examples

### **1. Simple Chat (React Component)**

```tsx
import { useGrok } from '@/hooks/useGrok';

function MyComponent() {
  const { chat, loading, error } = useGrok();

  const handleChat = async () => {
    const response = await chat('What are the best neighborhoods in NYC?');
    console.log(response);
  };

  return (
    <button onClick={handleChat} disabled={loading}>
      {loading ? 'Asking Grok...' : 'Ask Grok'}
    </button>
  );
}
```

### **2. Generate Property Description**

```tsx
import { useGrok } from '@/hooks/useGrok';

function PropertyForm() {
  const { generatePropertyDescription, loading } = useGrok();

  const handleGenerate = async () => {
    const description = await generatePropertyDescription({
      title: 'Luxury Penthouse',
      location: 'Manhattan, NY',
      price: 2500000,
      bedrooms: 3,
      bathrooms: 2.5,
      squareFeet: 2800,
    });
    
    console.log(description);
  };

  return (
    <button onClick={handleGenerate} disabled={loading}>
      Generate AI Description
    </button>
  );
}
```

### **3. Analyze User Message**

```tsx
import { useGrok } from '@/hooks/useGrok';

function MessageInbox() {
  const { analyzeMessage } = useGrok();

  const handleNewMessage = async (message: string) => {
    const analysis = await analyzeMessage(message);
    
    // analysis = {
    //   intent: 'question',
    //   sentiment: 'positive',
    //   urgency: 'medium'
    // }
    
    if (analysis?.urgency === 'high') {
      alert('Priority message!');
    }
  };

  return <div>...</div>;
}
```

### **4. Smart Search Suggestions**

```tsx
import { useGrok } from '@/hooks/useGrok';

function SearchBar() {
  const { getSearchSuggestions, loading } = useGrok();
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSearch = async (query: string) => {
    const results = await getSearchSuggestions(query, 5);
    if (results) setSuggestions(results);
  };

  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {suggestions.map(s => <div key={s}>{s}</div>)}
    </div>
  );
}
```

### **5. Direct API Call (Server-Side)**

```tsx
// In API route or server component
import { chatWithGrok } from '@/lib/xai';

export async function POST(request: Request) {
  const { question } = await request.json();
  
  const answer = await chatWithGrok(
    question,
    'You are a helpful real estate assistant.'
  );
  
  return Response.json({ answer });
}
```

---

## 🎨 Ready-to-Use Components

### **Full Chat Interface**

```tsx
import { GrokChat } from '@/components/ai/GrokChat';

export default function ChatPage() {
  return (
    <div className="container mx-auto py-8">
      <GrokChat />
    </div>
  );
}
```

### **Property Description Generator**

```tsx
import { PropertyDescriptionGenerator } from '@/components/ai/GrokChat';

export default function ListingPage() {
  return (
    <div className="container mx-auto py-8">
      <PropertyDescriptionGenerator />
    </div>
  );
}
```

---

## 🔌 API Endpoints

### **POST /api/ai/grok**

**General Chat:**
```json
POST /api/ai/grok
{
  "message": "What makes a good property listing?",
  "systemPrompt": "You are a real estate expert.",
  "action": "chat"
}
```

**Generate Property Description:**
```json
POST /api/ai/grok
{
  "action": "generatePropertyDescription",
  "data": {
    "title": "Modern Apartment",
    "location": "Brooklyn, NY",
    "price": 750000,
    "bedrooms": 2,
    "bathrooms": 2
  }
}
```

**Analyze Message:**
```json
POST /api/ai/grok
{
  "message": "URGENT: Need help with contract NOW!",
  "action": "analyzeMessage"
}
```

**Search Suggestions:**
```json
POST /api/ai/grok
{
  "message": "apartments near central park",
  "action": "searchSuggestions",
  "data": { "limit": 5 }
}
```

### **GET /api/ai/grok**

Check if API is configured:
```bash
curl http://localhost:3000/api/ai/grok
```

Response:
```json
{
  "status": "ok",
  "configured": true,
  "message": "XAI API is configured"
}
```

---

## 🎯 Use Cases in CollabConnect

### **1. Smart Property Listings**
- Auto-generate compelling property descriptions
- Suggest optimal pricing based on features
- Create SEO-friendly titles and tags

### **2. Intelligent Search**
- Provide search autocomplete suggestions
- Understand natural language queries
- Suggest related properties

### **3. User Communication**
- Analyze message sentiment and urgency
- Auto-categorize support tickets
- Suggest quick responses

### **4. Document Analysis**
- Summarize long documents
- Extract key information from contracts
- Answer questions about uploaded files

### **5. Virtual Assistant**
- Answer user questions about the platform
- Provide real estate market insights
- Help with navigation and features

---

## ⚙️ Advanced Configuration

### **Customize Model Settings**

```typescript
import { callGrok } from '@/lib/xai';

const response = await callGrok(
  [
    { role: 'system', content: 'You are a professional realtor.' },
    { role: 'user', content: 'Describe this property...' }
  ],
  {
    model: 'grok-beta',      // Model version
    temperature: 0.7,        // Creativity (0-1)
    maxTokens: 1000,        // Response length
  }
);
```

### **Environment Variables**

Add to Vercel or your production environment:

```bash
# Required
XAI_API_KEY="<your-xai-api-key>"

# Optional - If you want to make it public
NEXT_PUBLIC_XAI_ENABLED="true"
```

---

## 🔒 Security Best Practices

✅ **API key is server-side only** - Never exposed to browser  
✅ **Authentication required** - All endpoints check user session  
✅ **Rate limiting recommended** - Use Upstash Redis to prevent abuse  
✅ **Input validation** - All user inputs are validated  

### **Add Rate Limiting (Optional)**

```typescript
// In your API route
import { ratelimit } from '@/lib/redis';

export async function POST(request: NextRequest) {
  const session = await auth();
  const identifier = session?.user?.id || 'anonymous';
  
  const { success } = await ratelimit.limit(identifier);
  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }
  
  // ... rest of your code
}
```

---

## 🧪 Testing

### **Test API Locally**

```bash
# Start dev server
npm run dev

# Test status endpoint
curl http://localhost:3000/api/ai/grok

# Test chat (requires auth)
curl -X POST http://localhost:3000/api/ai/grok \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello Grok!", "action": "chat"}'
```

### **Test in Browser Console**

```javascript
// Simple test
fetch('/api/ai/grok', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'What is CollabConnect?',
    action: 'chat'
  })
})
.then(r => r.json())
.then(console.log);
```

---

## 📊 Monitoring & Logs

Check your XAI usage at: https://console.x.ai/

**Log XAI API calls:**
```typescript
// Add to src/lib/xai.ts
console.log('XAI Request:', {
  model: request.model,
  messageCount: messages.length,
  timestamp: new Date().toISOString(),
});
```

---

## 🚀 Deployment to Vercel

### **Add Environment Variable**

1. Go to: https://vercel.com/[your-username]/collab-connect/settings/environment-variables
2. Add new variable:
  - **Name:** `XAI_API_KEY`
  - **Value:** `<your-xai-api-key>`
   - **Environments:** Production, Preview, Development
3. Click "Save"
4. Redeploy your app

---

## 💡 Tips & Tricks

### **1. Optimize Token Usage**
- Use shorter system prompts
- Limit max_tokens for faster responses
- Cache frequently used responses

### **2. Better Responses**
- Be specific in prompts
- Provide context and examples
- Use appropriate temperature (0.7 for creative, 0.3 for factual)

### **3. Error Handling**
- Always check for null responses
- Implement fallbacks for API failures
- Show user-friendly error messages

### **4. Performance**
- Stream responses for long outputs (coming soon)
- Implement caching with Redis
- Use background jobs for non-urgent tasks

---

## 🆘 Troubleshooting

### **"XAI_API_KEY is not configured"**
- Check `.env` file has the key
- Restart dev server: `Ctrl+C` then `npm run dev`
- Verify no typos in environment variable name

### **"Unauthorized" Error**
- User must be logged in
- Check session is working: `await auth()`
- Test with authenticated user

### **Rate Limit Errors**
- XAI has usage limits
- Check your quota at https://console.x.ai/
- Implement client-side rate limiting

### **Slow Responses**
- Reduce `max_tokens`
- Use lower temperature (0.3-0.5)
- Consider caching common queries

---

## 📚 Resources

- **XAI Documentation:** https://docs.x.ai/
- **XAI Console:** https://console.x.ai/
- **API Status:** https://status.x.ai/
- **Grok Models:** https://docs.x.ai/docs/models

---

## ✅ Quick Start Checklist

- [x] XAI_API_KEY added to `.env`
- [x] XAI_API_KEY added to `.env.example`
- [x] Core library created (`src/lib/xai.ts`)
- [x] API route created (`src/app/api/ai/grok/route.ts`)
- [x] React hook created (`src/hooks/useGrok.ts`)
- [x] UI components created (`src/components/ai/GrokChat.tsx`)
- [ ] Test API locally
- [ ] Add to your pages/components
- [ ] Deploy to Vercel with environment variable
- [ ] Monitor usage at console.x.ai

---

## 🎉 You're Ready!

Your Grok AI integration is complete and ready to use!

**Try it now:**
1. Start dev server: `npm run dev`
2. Create a test page with `<GrokChat />`
3. Ask Grok a question!

**Next Steps:**
1. Add Grok chat to your dashboard
2. Use AI property descriptions in listings
3. Implement smart search suggestions
4. Add message sentiment analysis

---

**Need help?** Check the examples above or test the API endpoints!
