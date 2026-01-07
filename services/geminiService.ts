
import { GoogleGenAI, Type } from "@google/genai";
import { VideoPackage } from "../types";

// ============================================
// KNOWLEDGE BASE: Modern Agent's Real Estate Playbook (115 Sources)
// ============================================
const PLAYBOOK_KNOWLEDGE = `
## BOSTON LUXURY REAL ESTATE VIDEO STRATEGY GUIDE (2025-2026)
## Extracted from Modern Agent's Real Estate Playbook (115 Sources)

### 1. VIDEO CONTENT FRAMEWORKS
- Optimal Format: Vertical short-form (TikTok, Reels, Shorts) for mobile viewing
- Hook Length: 3-5 seconds, total video under 60 seconds for max retention
- Hook Structures:
  * "Unexpected Truth" formula: "Most people think you need 20% down in Boston... here's why they're wrong"
  * "Timeframe Tension": "How this Back Bay condo sold in 4 days"
- Script Format: "Moments over Theory" - start with specific scenarios or stunning reveals, not concepts
- CTA Patterns: Focus on "Sends" and "Shares" as primary engagement
  * "Share this with a friend who loves Federal-style architecture"
  * "Comment 'Home' for the 2026 Market Snapshot"

### 2. LUXURY MARKET POSITIONING
- Position "Urban Core" as rate-insensitive, high-net-worth enclaves (cash buyers dominate)
- Use "Hyper-Local Alpha" - info beyond Zillow
- Focus on "Lifestyle Migration" not just property purchase
- Scarcity: "Three-Phase Marketing" with "Coming Soon" pre-MLS buzz
- Avoid "Inventory Clusters" to maintain unique appeal

### 3. BOSTON NEIGHBORHOOD INSIGHTS
- **Seaport**: Redefining luxury urban living - rooftop pools, 24/7 concierge, international investment
- **Back Bay & Beacon Hill**: Luxury enclaves, $1,500+/sqft, Federal/Greek Revival architecture
- **South End**: "Stylish and Walkable" - historic charm meets modern lifestyle, high-end staging
- **Cambridge**: Diverse culture, walkable to Harvard/MIT, green space demand
- **Brookline**: Family powerhouse, tree-lined streets, median often exceeds $2M

### 4. HIGH-CONVERTING SCRIPT TEMPLATES
- Opening Hooks:
  * "Wait until you see the hidden room in this property"
  * "The one thing I wish every first-time buyer in Boston knew"
- Authority Builders:
  * "I just sold a home on [Street] for [Percent] above asking. Here's how we did it"
  * "Market Mythbusters" - debunk misconceptions about 2026 "Great Housing Reset"
- Urgency Creators:
  * "We're wrapping up offers for [Neighborhood] this week. Don't get outmaneuvered by strategic buyers"

### 5. VISUAL PRODUCTION STANDARDS
- Lighting: Maximize natural light, fresh flowers/lighter fabrics for "summer vibes"
- Camera: Smooth, immersive walkthroughs - let viewers envision themselves living there
- B-Roll: Capture "Hyper-Local Alpha" - transit hubs (Green/Red Line), coffee shops, landmarks
- Authenticity: "Raw and Real" over slick - candid "talk to camera" builds higher trust

### 6. ENGAGEMENT TACTICS
- Comment Drivers: "This or That" reels, "Price Check" challenges (guess the listing price)
- Trending Formats: "Day in the Life" time-lapses to humanize agent brand
- Posting: 3-5 high-quality posts/week, 1-2 daily Stories for visibility
- Collaborations: Tag local businesses/builders to tap their audiences

### 7. OBJECTION HANDLING
- "Prices must be dropping": Explain "Iron Triangle" - low inventory + high demand + strong incomes = stable prices
- "Wait and see": Counter with "Window of Opportunity" - buy now before competition surge when rates drop below 6%
- Cost concerns: Model "Total Cost of Ownership" - address city tax shifts from commercial to residential

### 8. MARKET DATA POINTS
- Pricing Power: Core Boston closes above $1,500/sqft regularly
- Speed: High-demand units go under contract in 22-32 days
- Affordability Gap: Required income jumped from $98K to $162K+ in 4 years
- Lead Conversion: Property valuation calculators increase digital leads by 238%

### PRODUCER ANALOGY
Creating luxury real estate video in Boston is like producing a high-end fashion runway show. The property is the garment, but the neighborhood insight is the brand legacy. You aren't just showing the fabric - you're selling exclusive access to the front row of the Boston lifestyle.
`;

const PRODUCER_SYSTEM_INSTRUCTION = `You are the Executive Producer for a Boston Luxury Real Estate Agency.

${PLAYBOOK_KNOWLEDGE}

## YOUR OBJECTIVE:
Convert topic requests into production-ready video packages that incorporate the playbook strategies above.

## EXECUTION REQUIREMENTS:
- Search for specific data points using Google Search for latest Boston market trends (2024-2026)
- Apply the video frameworks and scripts from the playbook
- Tone: Authoritative, high-energy, local expert
- Agent Description: Professional Boston Real Estate Agent, athletic build, short dark hair, wearing a custom navy slim-fit Italian wool suit with a silk tie
- Visual Prompts: Must include "Cinematic, Vertical 9:16, Photorealistic, 4k"

Return result as JSON matching the requested schema.`;

export async function generateVideoPackage(topic: string): Promise<VideoPackage> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Topic: ${topic}.

Generate a luxury video package that:
1. Uses hooks and frameworks from the Modern Agent's Playbook
2. Incorporates real-time Boston market data via search
3. Creates scroll-stopping content optimized for social media
4. Positions the agent as the #1 authority in this market segment`,
    config: {
      systemInstruction: PRODUCER_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      tools: [{ googleSearch: {} }],
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Attention-grabbing title using playbook hooks" },
          script_text: { type: Type.STRING, description: "Full video script with hook, body, CTA structure" },
          visual_prompts: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "5-7 cinematic shot descriptions for Veo generation"
          },
          caption: { type: Type.STRING, description: "Social media caption with hashtags and CTA" }
        },
        required: ["title", "script_text", "visual_prompts", "caption"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text.trim());
}

export async function editImage(base64Image: string, prompt: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
        { text: `Edit this luxury real estate photo: ${prompt}. Maintain high-end aesthetic. Apply golden hour lighting principles.` }
      ]
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  throw new Error("Failed to edit image");
}

export async function generateVeoVideo(base64Image: string, prompt: string, ratio: '16:9' | '9:16' = '16:9') {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  // Enhance prompt with playbook production standards
  const enhancedPrompt = `${prompt}. Cinematic quality, smooth camera motion, luxury real estate aesthetic, golden hour lighting where appropriate, professional grade.`;

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: enhancedPrompt,
    image: {
      imageBytes: base64Image,
      mimeType: 'image/jpeg',
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: ratio
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
