
import { GoogleGenAI, Type } from "@google/genai";
import { VideoPackage, ContentSuiteResult, CompetitorIQResult, SalesAceResult, SocialPostResult, ProposalResult } from "../types";

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

// ============================================
// CONTENT SUITE - Content Multiplier
// ============================================
export async function generateContentSuite(topic: string): Promise<ContentSuiteResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Topic: ${topic}

Generate a complete professional content suite for Boston luxury real estate marketing:
1. Video Script - 90 seconds with hook, value, CTA
2. Slide Deck Outline - 10 slides with speaker notes
3. Infographic Structure - 5 data points with context
4. Podcast Script - 5 minute engaging episode
5. Quiz Questions - 5 engaging questions about the topic
6. Data Table - Key market statistics

Make all content specific to Boston luxury real estate market.`,
    config: {
      systemInstruction: `You are a content strategist for Boston luxury real estate. ${PLAYBOOK_KNOWLEDGE}`,
      responseMimeType: "application/json",
      tools: [{ googleSearch: {} }],
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          videoScript: { type: Type.STRING, description: "90-second video script with timestamps" },
          slideDeck: { type: Type.STRING, description: "10 slides with speaker notes" },
          infographic: { type: Type.STRING, description: "5 data points with visual descriptions" },
          podcastScript: { type: Type.STRING, description: "5-minute podcast episode script" },
          quizQuestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5 quiz questions" },
          dataTable: { type: Type.STRING, description: "Market data table in markdown format" }
        },
        required: ["videoScript", "slideDeck", "infographic", "podcastScript", "quizQuestions", "dataTable"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text.trim());
}

// ============================================
// COMPETITOR IQ - Competitor Analysis
// ============================================
export async function generateCompetitorAnalysis(
  myCompany: string,
  competitors: string[]
): Promise<CompetitorIQResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `My Company: ${myCompany}
Competitors: ${competitors.join(', ')}

Generate a comprehensive competitor analysis for a Boston luxury real estate agency:
1. Strengths/Weaknesses Matrix - Compare all companies
2. Pricing/Positioning Analysis - How each positions in market
3. Messaging Analysis - Brand voice and key messages
4. Counter-Positioning Strategy - How to differentiate
5. Sales Battle Card - Kill points and rebuttals`,
    config: {
      systemInstruction: `You are a competitive intelligence analyst for luxury real estate. Research competitors thoroughly using web search. ${PLAYBOOK_KNOWLEDGE}`,
      responseMimeType: "application/json",
      tools: [{ googleSearch: {} }],
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          strengthsWeaknesses: { type: Type.STRING, description: "Matrix comparing all companies" },
          pricingAnalysis: { type: Type.STRING, description: "Pricing and positioning analysis" },
          messagingAnalysis: { type: Type.STRING, description: "Brand messaging analysis" },
          counterPositioning: { type: Type.STRING, description: "Differentiation strategy" },
          battleCard: { type: Type.STRING, description: "Sales battle card with kill points" }
        },
        required: ["strengthsWeaknesses", "pricingAnalysis", "messagingAnalysis", "counterPositioning", "battleCard"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text.trim());
}

// ============================================
// SALES ACE - Objection Handling
// ============================================
export async function generateSalesAce(
  productName: string,
  industry: string,
  dealSize: string,
  valueProps: string,
  competitors: string
): Promise<SalesAceResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Product/Service: ${productName}
Industry: ${industry}
Deal Size: ${dealSize}
Value Propositions: ${valueProps}
Competitors: ${competitors}

Generate comprehensive sales enablement materials:
1. 15 Objection Handling Frameworks (Acknowledge, Clarify, Respond, Confirm, Advance)
2. Competitor Battlecard with "When they say X, we say Y" scripts
3. 9 Voicemail Scripts (3 cold, 3 warm, 3 stalled)
4. 5 Role-Play Scenarios with escalating difficulty
5. Quick Reference Card with top 10 objections and one-liners`,
    config: {
      systemInstruction: `You are an expert sales strategist for luxury real estate. Create actionable, field-ready sales materials. ${PLAYBOOK_KNOWLEDGE}`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          objectionFrameworks: { type: Type.STRING, description: "15 detailed objection frameworks" },
          competitorBattlecard: { type: Type.STRING, description: "Competitor rebuttals and kill points" },
          voicemailScripts: { type: Type.STRING, description: "9 voicemail scripts by category" },
          rolePlayScenarios: { type: Type.STRING, description: "5 role-play scenarios" },
          quickReferenceCard: { type: Type.STRING, description: "Top 10 objections cheat sheet" }
        },
        required: ["objectionFrameworks", "competitorBattlecard", "voicemailScripts", "rolePlayScenarios", "quickReferenceCard"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text.trim());
}

// ============================================
// SOCIAL POSTS - Video Script & Post Generator
// ============================================
export async function generateSocialPost(
  topicIdea: string,
  postStyle: string,
  industry: string,
  videoStyle: string,
  ctaGoal: string
): Promise<SocialPostResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Topic: ${topicIdea}
Post Style: ${postStyle}
Industry: ${industry}
Video Style: ${videoStyle}
CTA Goal: ${ctaGoal}

Generate:
1. 8-Second Video Script with HOOK (0-2s), VALUE (2-6s), CTA (6-8s), and ON-SCREEN TEXT
2. Detailed Gemini/Veo Video Prompt with visual style, scene breakdown, audio, text overlays
3. LinkedIn Post with hook, paragraphs, CTA, and 5 hashtags`,
    config: {
      systemInstruction: `You are a social media content creator for luxury real estate. Create scroll-stopping content. Brand colors: Dark background (#0A0A0F), cyan (#00D4FF). ${PLAYBOOK_KNOWLEDGE}`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          videoScript: { type: Type.STRING, description: "8-second video script with timing" },
          geminiPrompt: { type: Type.STRING, description: "Detailed video generation prompt" },
          linkedinPost: { type: Type.STRING, description: "LinkedIn post with hashtags" },
          characterCount: { type: Type.NUMBER, description: "Character count of LinkedIn post" }
        },
        required: ["videoScript", "geminiPrompt", "linkedinPost", "characterCount"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text.trim());
}

// ============================================
// PROPOSALS - Business Proposal Generator
// ============================================
export async function generateProposal(
  prospectName: string,
  companyName: string,
  industry: string,
  painPoints: string,
  proposedSolution: string,
  pricing: string
): Promise<ProposalResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Prospect: ${prospectName}
Company: ${companyName}
Industry: ${industry}
Pain Points: ${painPoints}
Proposed Solution: ${proposedSolution}
Pricing: ${pricing}

Generate a comprehensive business proposal:
1. Executive Summary - High-level overview
2. Problem Statement - Client's pain points
3. Scope of Work - Services/products to deliver
4. Timeline - Implementation schedule
5. Investment Breakdown - Detailed costs
6. Next Steps - Actions to move forward`,
    config: {
      systemInstruction: `You are an expert business proposal writer for luxury real estate services. Create professional, persuasive proposals.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          executiveSummary: { type: Type.STRING, description: "Executive summary" },
          problemStatement: { type: Type.STRING, description: "Problem statement" },
          scopeOfWork: { type: Type.STRING, description: "Scope of work" },
          timeline: { type: Type.STRING, description: "Implementation timeline" },
          investmentBreakdown: { type: Type.STRING, description: "Investment breakdown" },
          nextSteps: { type: Type.STRING, description: "Next steps" }
        },
        required: ["executiveSummary", "problemStatement", "scopeOfWork", "timeline", "investmentBreakdown", "nextSteps"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text.trim());
}
