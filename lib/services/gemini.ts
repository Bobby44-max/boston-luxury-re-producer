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
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

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

// Advanced reasoning with Gemini 1.5 Pro
export async function reason(
  systemPrompt: string,
  userPrompt: string,
  options: { model?: string; temperature?: number; responseMimeType?: string } = {}
) {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ 
    model: options.model || 'gemini-1.5-pro',
    systemInstruction: systemPrompt 
  });

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    generationConfig: {
      temperature: options.temperature ?? 0.7,
      responseMimeType: options.responseMimeType || 'application/json',
    },
  });

  const text = result.response.text();
  if (!text) throw new Error('No response from AI');
  
  return options.responseMimeType === 'application/json' ? JSON.parse(text.trim()) : text;
}

// Blueprint B: Design DNA Cloner
// Extracts CSS variables, palette, and typography for Shadcn implementation
export async function extractDesignDNA(url: string, brandingData: Record<string, unknown>) {
  const systemPrompt = `
You are an elite UI Engineer and Design System Architect.
Your goal is to extract the "Design DNA" from a website's raw branding data.
Transform this into a machine-ready specification for a Shadcn/Tailwind implementation.

Analyze:
1. Visual Hierarchy: Line heights, font weights, spacing.
2. Color Systems: Primary, secondary, accent, and semantic (success/error) colors.
3. Shape Language: Border-radius (rounded-lg, rounded-full), border-widths.
4. Typography: Font families, scale, and fallback fonts.
`;

  const userPrompt = `
URL: ${url}
Branding Data: ${JSON.stringify(brandingData)}

Return a JSON object matching this structure:
{
  "theme": {
    "colors": { "primary": "hex", "secondary": "hex", "accent": "hex", "background": "hex", "foreground": "hex" },
    "typography": { "display": "font name", "body": "font name", "scale": "decimal" },
    "shape": { "borderRadius": "string (e.g. 0.5rem)", "borderWidth": "string" }
  },
  "shadcnConfig": {
    "cssVars": { "primary": "hsl", "background": "hsl", ... },
    "radius": "number"
  },
  "visualSignature": "A 2-sentence description of the brand aesthetic"
}
`;

  return reason(systemPrompt, userPrompt, { model: 'gemini-1.5-pro' });
}

// Blueprint A: SEO & GEO (Generative Engine Optimization) Audit
export async function runGEOAudit(url: string, markdown: string) {
  const systemPrompt = `
You are a Research Intelligence Officer specializing in Generative Engine Optimization (GEO).
Traditional SEO is dead; we optimize for AI Answer Engines (Perplexity, SearchGPT, Gemini).

Focus on:
1. Citability: How easy is it for an AI to cite this content?
2. Entity Density: Are key industry entities clearly defined?
3. Information Gain: Does this page provide unique data not found elsewhere?
4. Technical Clarity: Semantic markup and structured data quality.
`;

  const userPrompt = `
URL: ${url}
Content: ${markdown.slice(0, 30000)}

Provide a detailed GEO Audit in JSON format:
{
  "citationScore": 0-100,
  "optimizationOpportunities": [
    { "area": "Entity Definition", "fix": "..." },
    { "area": "Information Gain", "fix": "..." }
  ],
  "aeoTactics": ["list of 5 specific tactics"],
  "contentGaps": ["what information is missing that an AI would want?"]
}
`;

  return reason(systemPrompt, userPrompt, { model: 'gemini-1.5-pro' });
}
