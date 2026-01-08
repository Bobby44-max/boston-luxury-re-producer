# Boston Luxury RE Producer

AI-powered content generation suite for Boston luxury real estate professionals.

## Features

- **Video Producer**: Generate video scripts, captions, and VEO prompts
- **Live Consultant**: Real-time voice AI consultation (requires Gemini Live API)
- **VEO Animator**: Image-to-video generation (requires VEO API)
- **Content Suite**: One topic generates 6 content assets
- **Competitor IQ**: AI-powered competitive analysis with Google Search grounding
- **Sales Ace**: Objection handling and sales enablement materials
- **Social Posts**: 8-second video scripts + LinkedIn posts
- **Proposals**: Professional business proposal generation

## Tech Stack

- Next.js 15 (App Router)
- React 19
- Tailwind CSS 4
- Google Generative AI SDK (@google/generative-ai)
- Lucide React icons

## Local Development

```bash
# Install dependencies
npm install

# Create .env.local with your Gemini API key
echo "GEMINI_API_KEY_FIREBASE=your-key-here" > .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### 1. Create a New Vercel Project

```bash
cd services/re-producer
npx vercel
```

### 2. Configure Environment Variables

In Vercel Dashboard > Project Settings > Environment Variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXTAUTH_URL` | Full URL: `https://realestate.apexai.technology` | Yes |
| `NEXTAUTH_SECRET` | Random secret for session encryption | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `GEMINI_API_KEY_FIREBASE` | Google Gemini API key for AI generation | Yes |
| `HEYGEN_API_KEY` | HeyGen API key for avatar videos | Optional |

**Important**: Add `https://realestate.apexai.technology/api/auth/callback/google` to your Google OAuth authorized redirect URIs in Google Cloud Console.

### 3. Configure Custom Domain

1. Go to Vercel Dashboard > Project > Settings > Domains
2. Add `realestate.apexai.technology`
3. Configure DNS at your domain registrar:
   - Type: CNAME
   - Name: realestate
   - Value: cname.vercel-dns.com

### 4. Deploy

```bash
npx vercel --prod
```

## API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/generate` | POST | Generate content (producer, content, competitor, sales, social, proposal) |

### Example Request

```bash
curl -X POST https://realestate.apexai.technology/api/generate \
  -H "Content-Type: application/json" \
  -d '{"tool": "producer", "topic": "Seaport luxury condos"}'
```

## Project Structure

```
services/re-producer/
├── app/
│   ├── api/generate/route.ts   # Server-side Gemini API calls
│   ├── globals.css             # Glass-panel design system
│   ├── layout.tsx              # Root layout with ambient effects
│   └── page.tsx                # Main UI (8 tool modes)
├── lib/
│   └── types.ts                # TypeScript interfaces
├── vercel.json                 # Vercel deployment config
└── package.json
```

## License

Proprietary - Apex AI Technology
