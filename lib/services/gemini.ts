import { GoogleGenerativeAI } from '@google/generative-ai';
import { Property } from './firecrawl';

// Initialize Gemini client
export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY_FIREBASE || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }
  return new GoogleGenerativeAI(apiKey);
}

export interface VideoScript {
  narration: string;
  scenes: {
    start: number;
    end: number;
    text: string;
    visual: string;
  }[];
  hookText?: string;
  ctaText?: string;
}

export interface ScriptOptions {
  videoType: string;
  duration?: number; // in seconds
  voiceStyle?: 'professional' | 'casual' | 'energetic';
  includePrice?: boolean;
}

// Generate video script from property data
export async function generateVideoScript(
  property: Property,
  options: ScriptOptions
): Promise<VideoScript> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-3-pro-preview' });

  const prompt = buildScriptPrompt(property, options);

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json',
    },
  });

  const text = result.response.text();
  if (!text) throw new Error('No response from AI');

  return JSON.parse(text.trim()) as VideoScript;
}

function buildScriptPrompt(property: Property, options: ScriptOptions): string {
  const { videoType, duration = 30, voiceStyle = 'professional' } = options;

  const formatPrice = (price: number) =>
    price >= 1000000
      ? `$${(price / 1000000).toFixed(1)}M`
      : `$${(price / 1000).toFixed(0)}K`;

  if (videoType === 'social-short') {
    return `
Generate a 9-second TikTok/Reels script for this property.

Property:
- Address: ${property.address}, ${property.city}, ${property.state}
- Price: ${formatPrice(property.price)}
- Beds: ${property.bedrooms} | Baths: ${property.bathrooms} | SqFt: ${property.sqft.toLocaleString()}
- Type: ${property.propertyType}
- Top Features: ${property.features.slice(0, 3).join(', ')}

Voice Style: ${voiceStyle}

Requirements:
1. Punchy hook (2 seconds max) - stop the scroll
2. 3 key stats with energy
3. CTA for link in bio
4. Gen-Z friendly but professional tone

Return JSON:
{
  "narration": "Full 9-second voiceover script",
  "hookText": "Bold text overlay for hook",
  "ctaText": "CTA text overlay",
  "scenes": [
    { "start": 0, "end": 2, "text": "Hook text", "visual": "Exterior shot" },
    { "start": 2, "end": 6, "text": "Stats", "visual": "Interior montage" },
    { "start": 6, "end": 9, "text": "CTA", "visual": "Logo + contact" }
  ]
}
`;
  }

  // Property Showcase (default)
  return `
Generate a ${duration}-second video script for a luxury property showcase.

Property Details:
- Address: ${property.address}, ${property.city}, ${property.state} ${property.zipCode}
- Price: ${formatPrice(property.price)}
- Bedrooms: ${property.bedrooms}
- Bathrooms: ${property.bathrooms}
- Square Feet: ${property.sqft.toLocaleString()}
- Property Type: ${property.propertyType}
- Year Built: ${property.yearBuilt || 'N/A'}
- Lot Size: ${property.lotSize || 'N/A'}
- Description: ${property.description.slice(0, 500)}
- Features: ${property.features.slice(0, 10).join(', ')}
- Neighborhood: ${property.neighborhood || property.city}

Voice Style: ${voiceStyle}

Requirements:
1. Opening hook mentioning price and neighborhood (3 seconds)
2. Key stats (beds, baths, sqft) with context (4 seconds)
3. Photo gallery narration highlighting features (13 seconds)
4. Feature highlights - top 3-4 selling points (5 seconds)
5. Call-to-action with urgency (5 seconds)

Tone: Aspirational, luxurious, exclusive. Speak to sophisticated buyers.

Return JSON:
{
  "narration": "Full ${duration}-second voiceover script, natural and conversational",
  "hookText": "Opening text overlay",
  "ctaText": "Closing CTA text",
  "scenes": [
    { "start": 0, "end": 3, "text": "Scene text", "visual": "Exterior hero shot" },
    { "start": 3, "end": 7, "text": "Scene text", "visual": "Stats overlay" },
    { "start": 7, "end": 20, "text": "Scene text", "visual": "Photo slideshow" },
    { "start": 20, "end": 25, "text": "Scene text", "visual": "Feature highlights" },
    { "start": 25, "end": 30, "text": "Scene text", "visual": "Contact info + logo" }
  ]
}
`;
}

// Generate insights from website analysis
export async function generateInsightsAnalysis(
  url: string,
  rawData: string
): Promise<{
  brandingStrategies: { value: string }[];
  seoKeywords: { value: string }[];
  aeoGeoOptimizationTactics: { value: string }[];
  uiUxPatterns: { value: string }[];
}> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

  const prompt = `
Analyze this website content and extract strategic insights.

URL: ${url}
Content: ${rawData.slice(0, 10000)}

Return JSON with these arrays (each item has a "value" field):

1. brandingStrategies (5 items): Unique positioning strategies visible
2. seoKeywords (7 items): High-value SEO keywords for this industry
3. aeoGeoOptimizationTactics (5 items): AI/search optimization tactics
4. uiUxPatterns (6 items): Notable UI/UX design patterns

Focus on actionable, specific insights. Be creative and thorough.
`;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 4096,
      responseMimeType: 'application/json',
    },
  });

  const text = result.response.text();
  if (!text) throw new Error('No response from AI');

  return JSON.parse(text.trim());
}
