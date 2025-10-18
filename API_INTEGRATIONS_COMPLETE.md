# 🔌 API Integrations - Complete Reference

**CollabConnect External API Strategy**

All integrated APIs are either **open source** or **free for personal/small business use**. No vendor lock-in, no hidden costs.

---

## 🗺️ **Maps & Geocoding**

### Primary: MapLibre GL + OpenStreetMap
- **MapLibre GL**: Open source map rendering
- **MapTiler**: Free tiles (100k loads/month)
- **Status**: ✅ Configured

### Geocoding Services (with fallbacks)

#### 1. **Nominatim** (OpenStreetMap)
- **Cost**: Free, open source
- **Limit**: 1 req/sec (be respectful)
- **Use**: Primary geocoding
- **Function**: `geocodeAddress()`, `reverseGeocode()`

#### 2. **LocationIQ**
- **Cost**: Free tier - 5,000 req/day
- **Limit**: 60 req/sec
- **Use**: Fallback for better performance
- **Function**: `geocodeAddressLocationIQ()`
- **Setup**: Get key at https://locationiq.com/

#### 3. **OpenCage**
- **Cost**: Free tier - 2,500 req/day
- **Limit**: 1 req/sec
- **Use**: Secondary fallback with detailed data
- **Function**: `geocodeAddressOpenCage()`
- **Setup**: Get key at https://opencagedata.com/

### IP Geolocation

#### **ipapi.co**
- **Cost**: Free (30k req/month)
- **Function**: `getIPLocation()`
- **No API key needed**

#### **GeoJS**
- **Cost**: Free, unlimited
- **Function**: `getIPLocationGeoJS()`
- **No API key needed**

#### **IPify**
- **Cost**: Free, unlimited
- **Function**: `getPublicIP()`
- **No API key needed**

---

## 🏠 **Real Estate & Property Data**

### **OpenStreetMap Overpass API**
- **Cost**: Free, open source
- **Function**: `getNearbyBuildings()`
- **Returns**: Building data, addresses, locations
- **No API key needed**

### **Zillow** (via RapidAPI)
- **Cost**: Free tier available
- **Function**: `searchZillowListings()`
- **Setup**: Get key at https://rapidapi.com/
- **ENV**: `RAPIDAPI_KEY`

### **UK Land Registry**
- **Cost**: Free official data
- **Data**: Property sales prices (UK only)
- **Format**: CSV download
- **Note**: Needs local parsing implementation

---

## 🌐 **Translation (Multi-language Support)**

### **LibreTranslate**
- **Cost**: Free, open source
- **Languages**: 20+ languages
- **Function**: `translateText()`
- **API**: `/api/translate` (POST)
- **Self-hostable**: Yes

### **MyMemory Translation**
- **Cost**: Free (10k words/day, more with email)
- **Function**: `translateTextMyMemory()`
- **Use**: Automatic fallback
- **ENV**: `MYMEMORY_EMAIL` (optional)

---

## 👤 **User Identity & Verification**

### **Gravatar**
- **Cost**: Free
- **Function**: `getGravatarUrl()`
- **Use**: Profile pictures by email hash
- **No API key needed**

### **Hunter.io**
- **Cost**: Free tier (25 verifications/month)
- **Function**: `verifyEmailHunter()`
- **Use**: Email deliverability verification
- **ENV**: `HUNTER_API_KEY`
- **Setup**: https://hunter.io/

---

## 🏢 **Transparency & Corporate Data**

### **OpenCorporates**
- **Cost**: Free tier (500 req/month)
- **Function**: `getCompanyData()`
- **Use**: Look up insurance companies, transparency
- **ENV**: `OPENCORPORATES_API_KEY`
- **Setup**: https://opencorporates.com/

---

## 🖼️ **Media & Assets**

### **Unsplash**
- **Cost**: Free (50 req/hour)
- **Functions**: 
  - `searchUnsplashImages()`
  - `getRandomUnsplashImage()`
- **Use**: Property photos, backgrounds, profiles
- **ENV**: `UNSPLASH_ACCESS_KEY`
- **Setup**: https://unsplash.com/developers

---

## 🔧 **Utility APIs**

### **QR Code Generator**
- **Cost**: Free
- **Function**: `generateQRCode()`
- **Use**: Profile sharing, invites
- **No API key needed**

---

## 💬 **Communication (Phase 2)**

### **Socket.io**
- **Cost**: Free, open source
- **Use**: Real-time chat and collaboration
- **Self-hosted**: Yes
- **No external API needed**

### **Supabase Realtime** (Alternative)
- **Cost**: Free tier (generous)
- **Use**: Real-time database, presence
- **ENV**: 
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- **Setup**: https://supabase.com/

---

## 🚦 **API Routes Available**

### **Location Services**
```bash
GET /api/location?action=geocode&address=...
GET /api/location?action=reverse&lat=...&lon=...
GET /api/location?action=ip
GET /api/location?action=nearby&lat=...&lon=...&radius=...
```

### **Property Search**
```bash
GET /api/properties?action=search&location=...&page=1
GET /api/properties?action=nearby&lat=...&lon=...&radius=1000
```

### **Translation**
```bash
POST /api/translate
Body: { text, targetLang, sourceLang }

GET /api/translate?action=languages
```

---

## 📊 **Rate Limits & Best Practices**

| API | Free Limit | Rate Limit | Fallback |
|-----|-----------|------------|----------|
| Nominatim | Unlimited | 1/sec | LocationIQ |
| LocationIQ | 5k/day | 60/sec | OpenCage |
| OpenCage | 2.5k/day | 1/sec | Nominatim |
| ipapi.co | 30k/month | 1k/day | GeoJS |
| LibreTranslate | Unlimited | Varies | MyMemory |
| MyMemory | 10k words/day | - | LibreTranslate |
| Unsplash | 50/hour | - | Local images |
| Hunter.io | 25/month | - | Basic validation |

---

## 🔐 **Environment Variables Setup**

Create `.env.local` (copy from `.env.example`):

```bash
# Essential (no cost)
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."

# Maps (free tier)
NEXT_PUBLIC_MAPTILER_KEY="get-from-maptiler"

# Optional enhancements (all free tier)
LOCATIONIQ_API_KEY="..."
OPENCAGE_API_KEY="..."
UNSPLASH_ACCESS_KEY="..."
HUNTER_API_KEY="..."
RAPIDAPI_KEY="..."
MYMEMORY_EMAIL="your@email.com"
```

---

## 🎯 **Implementation Priority**

### Phase 1: Core (NOW) ✅
- [x] Geocoding (Nominatim + fallbacks)
- [x] IP Location
- [x] Translation (LibreTranslate + MyMemory)
- [x] Gravatar integration
- [x] Property/building search

### Phase 2: Enhancement (NEXT)
- [ ] Real-time chat (Socket.io)
- [ ] Unsplash integration
- [ ] Email verification (Hunter.io)
- [ ] Zillow listings

### Phase 3: Advanced (LATER)
- [ ] Corporate transparency (OpenCorporates)
- [ ] UK property data parsing
- [ ] Self-hosted LibreTranslate instance
- [ ] Advanced analytics

---

## 📝 **Philosophy**

Every API here was chosen because:

1. **Free or Open Source** - No barriers to entry
2. **No Vendor Lock-in** - Can self-host or switch
3. **Ethical** - Respects privacy and transparency
4. **Reliable** - Has fallback options

**"The system's rigged, but we've got the APIs to rig it back."**

---

## 🆘 **Troubleshooting**

### API not working?
1. Check `.env.local` has the required key
2. Verify key is active on provider dashboard
3. Check console for error messages
4. Test fallback APIs

### Rate limited?
1. Implement caching (Redis/Upstash)
2. Use fallback APIs
3. Upgrade to paid tier if needed (still cheap)

### Need help?
- Check API documentation links above
- Review `/src/lib/api-integrations.ts` implementations
- All providers have free support/docs
