import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ==================== KNOWLEDGE BASE ====================
const PLAYBOOK_KNOWLEDGE = `
## BOSTON LUXURY REAL ESTATE VIDEO STRATEGY GUIDE (2025-2026)

### 1. VIDEO CONTENT FRAMEWORKS
- Optimal Format: Vertical short-form (TikTok, Reels, Shorts) for mobile viewing
- Hook Length: 3-5 seconds, total video under 60 seconds for max retention
- Hook Structures:
  * "Unexpected Truth" formula: "Most people think you need 20% down in Boston... here's why they're wrong"
  * "Timeframe Tension": "How this Back Bay condo sold in 4 days"
- Script Format: "Moments over Theory" - start with specific scenarios or stunning reveals
- CTA Patterns: Focus on "Sends" and "Shares" as primary engagement

### 2. LUXURY MARKET POSITIONING
- Position "Urban Core" as rate-insensitive, high-net-worth enclaves
- Use "Hyper-Local Alpha" - info beyond Zillow
- Focus on "Lifestyle Migration" not just property purchase

### 3. BOSTON NEIGHBORHOOD INSIGHTS
- **Seaport**: Rooftop pools, 24/7 concierge, international investment
- **Back Bay & Beacon Hill**: $1,500+/sqft, Federal/Greek Revival architecture
- **South End**: Historic charm meets modern lifestyle
- **Cambridge**: Harvard/MIT, green space demand
- **Brookline**: Family powerhouse, median often exceeds $2M

### 4. MARKET DATA POINTS
- Core Boston closes above $1,500/sqft regularly
- High-demand units go under contract in 22-32 days
- Lead Conversion: Property valuation calculators increase leads by 238%
`;

function getGeminiClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY_FIREBASE || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured");
  }
  return new GoogleGenerativeAI(apiKey);
}

async function generateWithGemini(prompt: string): Promise<string> {
  const genAI = getGeminiClient();
  // Note: Google Search Grounding is incompatible with JSON response mode
  // Using standard generation with JSON output
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
  });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    },
  });

  const text = result.response.text();
  if (!text) throw new Error("No response from AI");
  return text;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tool, ...params } = body;

    let result: unknown;

    switch (tool) {
      case "producer": {
        const prompt = `You are the Executive Producer for a Boston Luxury Real Estate Agency.

${PLAYBOOK_KNOWLEDGE}

Topic: ${params.topic}

Generate a luxury video package. Return ONLY valid JSON:
{
  "title": "Attention-grabbing title using playbook hooks",
  "script_text": "Full video script with hook (3-5s), body, CTA structure",
  "visual_prompts": ["Cinematic shot 1", "Cinematic shot 2", "Cinematic shot 3", "Cinematic shot 4", "Cinematic shot 5"],
  "caption": "Social media caption with hashtags and CTA"
}`;
        const text = await generateWithGemini(prompt);
        result = JSON.parse(text.trim());
        break;
      }

      case "content": {
        const prompt = `You are a content strategist for Boston luxury real estate.

${PLAYBOOK_KNOWLEDGE}

Topic: ${params.topic}

Generate a complete content suite. Return ONLY valid JSON:
{
  "videoScript": "90-second video script with timestamps and CTA",
  "slideDeck": "10 slides with speaker notes",
  "infographic": "5 data points with visual descriptions",
  "podcastScript": "5-minute podcast episode script",
  "quizQuestions": ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"],
  "dataTable": "Market data table in markdown format"
}`;
        const text = await generateWithGemini(prompt);
        result = JSON.parse(text.trim());
        break;
      }

      case "competitor": {
        const prompt = `You are a competitive intelligence analyst for luxury real estate.

${PLAYBOOK_KNOWLEDGE}

My Company: ${params.companyName}
Competitors: ${params.competitors.join(", ")}

Generate competitor analysis. Return ONLY valid JSON:
{
  "strengthsWeaknesses": "Matrix comparing all companies",
  "pricingAnalysis": "Pricing and positioning analysis",
  "messagingAnalysis": "Brand messaging analysis",
  "counterPositioning": "Differentiation strategy",
  "battleCard": "Sales battle card with kill points"
}`;
        const text = await generateWithGemini(prompt);
        result = JSON.parse(text.trim());
        break;
      }

      case "sales": {
        const prompt = `You are an expert sales strategist for luxury real estate.

${PLAYBOOK_KNOWLEDGE}

Product: ${params.productName}
Industry: ${params.industry}
Deal Size: ${params.dealSize}
Value Props: ${params.valueProps}
Competitors: ${params.competitors}

Generate sales enablement materials. Return ONLY valid JSON:
{
  "objectionFrameworks": "15 objection handling frameworks",
  "competitorBattlecard": "Competitor rebuttals and kill points",
  "voicemailScripts": "9 voicemail scripts (3 cold, 3 warm, 3 stalled)",
  "rolePlayScenarios": "5 role-play scenarios",
  "quickReferenceCard": "Top 10 objections cheat sheet"
}`;
        const text = await generateWithGemini(prompt);
        result = JSON.parse(text.trim());
        break;
      }

      case "social": {
        const prompt = `You are a social media content creator for luxury real estate.

${PLAYBOOK_KNOWLEDGE}

Topic: ${params.topic}
Style: ${params.postStyle}
Video Style: ${params.videoStyle}
CTA Goal: ${params.ctaGoal}

Generate social content. Return ONLY valid JSON:
{
  "videoScript": "8-second video script with HOOK (0-2s), VALUE (2-6s), CTA (6-8s)",
  "geminiPrompt": "Detailed Veo video generation prompt",
  "linkedinPost": "LinkedIn post with hook, paragraphs, CTA, and 5 hashtags",
  "characterCount": 1500
}`;
        const text = await generateWithGemini(prompt);
        result = JSON.parse(text.trim());
        break;
      }

      case "proposal": {
        const prompt = `You are an expert business proposal writer for luxury real estate.

Prospect: ${params.prospectName}
Company: ${params.companyName}
Industry: ${params.industry}
Pain Points: ${params.painPoints}
Proposed Solution: ${params.proposedSolution}
Pricing: ${params.pricing}

Generate a business proposal. Return ONLY valid JSON:
{
  "executiveSummary": "High-level overview",
  "problemStatement": "Client's pain points",
  "scopeOfWork": "Services/products to deliver",
  "timeline": "Implementation schedule",
  "investmentBreakdown": "Detailed costs",
  "nextSteps": "Actions to move forward"
}`;
        const text = await generateWithGemini(prompt);
        result = JSON.parse(text.trim());
        break;
      }

      default:
        return NextResponse.json({ error: "Unknown tool" }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
