import Firecrawl from '@mendable/firecrawl-js';
import { z } from 'zod';

// Initialize Firecrawl client
export function getFirecrawlClient() {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    throw new Error('FIRECRAWL_API_KEY not configured');
  }
  return new Firecrawl({ apiKey });
}

// Property data schema for video generation
export const PropertySchema = z.object({
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  price: z.number(),
  bedrooms: z.number(),
  bathrooms: z.number(),
  sqft: z.number(),
  lotSize: z.string().optional(),
  yearBuilt: z.number().optional(),
  propertyType: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  images: z.array(z.string()),
  neighborhood: z.string().optional(),
  agent: z.object({
    name: z.string(),
    phone: z.string().optional(),
    email: z.string().optional(),
    brokerage: z.string().optional(),
  }).optional(),
});

export type Property = z.infer<typeof PropertySchema>;

// Insights schema (for the branding/SEO/UI analysis you showed)
export const InsightsSchema = z.object({
  brandingStrategies: z.array(z.object({
    value: z.string(),
  })).optional(),
  seoKeywords: z.array(z.object({
    value: z.string(),
  })).optional(),
  aeoGeoOptimizationTactics: z.array(z.object({
    value: z.string(),
  })).optional(),
  uiUxPatterns: z.array(z.object({
    value: z.string(),
  })).optional(),
});

export type Insights = z.infer<typeof InsightsSchema>;

// Extraction prompts
const PROPERTY_EXTRACTION_PROMPT = `
Extract all property listing information from this page.
Focus on:
1. Complete address with city, state, zip
2. Price as a raw number (no $ or commas)
3. All bedroom/bathroom counts (use decimals for half baths)
4. Square footage (interior only)
5. All high-resolution image URLs (prioritize exterior, kitchen, living room)
6. Property features and amenities as a list
7. Agent/broker contact information if visible
8. Neighborhood name if mentioned

For images:
- Extract the highest resolution version available
- Include at least 10 images if available
- Skip thumbnails or icons

Return structured JSON matching the schema.
`;

const INSIGHTS_EXTRACTION_PROMPT = `
Analyze this website and extract strategic insights:

1. brandingStrategies: 5 unique positioning or branding strategies visible
2. seoKeywords: 7 high-value SEO keywords for this industry
3. aeoGeoOptimizationTactics: 5 AI/search optimization tactics
4. uiUxPatterns: 6 notable UI/UX design patterns

Each item should have a "value" field with a descriptive string.
Focus on actionable, specific insights that could be implemented.
`;

// Scrape a property listing URL
export async function scrapeProperty(url: string): Promise<Property> {
  const firecrawl = getFirecrawlClient();

  try {
    const result = await firecrawl.extract([url], {
      prompt: PROPERTY_EXTRACTION_PROMPT,
      schema: PropertySchema,
    });

    if (!result.success || !result.data) {
      throw new Error('No data extracted from URL');
    }

    // Validate and clean the data
    return validatePropertyData(result.data);
  } catch (error) {
    console.error('Firecrawl property extraction error:', error);
    throw new Error(`Failed to scrape property: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Scrape website for strategic insights
export async function scrapeInsights(url: string): Promise<Insights> {
  const firecrawl = getFirecrawlClient();

  try {
    const result = await firecrawl.extract([url], {
      prompt: INSIGHTS_EXTRACTION_PROMPT,
      schema: InsightsSchema,
    });

    if (!result.success || !result.data) {
      throw new Error('No insights extracted from URL');
    }

    return result.data as Insights;
  } catch (error) {
    console.error('Firecrawl insights extraction error:', error);
    throw new Error(`Failed to extract insights: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Validate and clean property data
function validatePropertyData(data: unknown): Property {
  const result = PropertySchema.safeParse(data);

  if (!result.success) {
    console.warn('Property validation warnings:', result.error.issues);

    // Return partial data with defaults
    const raw = data as Record<string, unknown>;
    return {
      address: (raw.address as string) || 'Address not available',
      city: (raw.city as string) || '',
      state: (raw.state as string) || '',
      zipCode: (raw.zipCode as string) || '',
      price: (raw.price as number) || 0,
      bedrooms: (raw.bedrooms as number) || 0,
      bathrooms: (raw.bathrooms as number) || 0,
      sqft: (raw.sqft as number) || 0,
      propertyType: (raw.propertyType as string) || 'residential',
      description: (raw.description as string) || '',
      features: (raw.features as string[]) || [],
      images: (raw.images as string[]) || [],
      lotSize: raw.lotSize as string | undefined,
      yearBuilt: raw.yearBuilt as number | undefined,
      neighborhood: raw.neighborhood as string | undefined,
      agent: raw.agent as Property['agent'],
    };
  }

  return result.data;
}

// Get high-resolution image URL
export function getHighResImage(url: string): string {
  // Zillow: replace size params
  if (url.includes('zillow') || url.includes('zillowstatic')) {
    return url.replace(/w=\d+/, 'w=1920').replace(/h=\d+/, 'h=1080');
  }

  // Redfin: use original size
  if (url.includes('redfin') || url.includes('ssl.cdn-redfin')) {
    return url.replace('/small/', '/big/').replace('/mobile/', '/desktop/');
  }

  // Realtor.com
  if (url.includes('realtor.com') || url.includes('rdcpix')) {
    return url.replace(/\?.*$/, ''); // Remove query params for full size
  }

  return url;
}

// Advanced extraction options for Web Intelligence
export interface ScrapeOptions {
  formats?: ('markdown' | 'html' | 'rawHtml' | 'screenshot' | 'links' | 'summary' | 'branding')[];
  maxAge?: number; // Caching in seconds
  waitFor?: number;
  onlyMainContent?: boolean;
}

// Scrape website with high-fidelity intelligence formats
export async function scrapeAdvanced(url: string, options: ScrapeOptions = {}) {
  const firecrawl = getFirecrawlClient();
  const { 
    formats = ['markdown', 'branding', 'screenshot'], 
    maxAge = 3600, // 1 hour cache default
    onlyMainContent = true 
  } = options;

  try {
    const result = await firecrawl.scrapeUrl(url, {
      formats,
      onlyMainContent,
      actions: [], // Can add scroll/click actions here
    });

    if (!result.success) {
      throw new Error(`Firecrawl scrape failed: ${result.error}`);
    }

    return result;
  } catch (error) {
    console.error('Firecrawl advanced scrape error:', error);
    throw error;
  }
}

// Select best images for video
export function selectBestImages(images: string[], count: number = 10): string[] {
  // Prioritize by filename patterns
  const categorized = {
    exterior: images.filter(i => /exterior|front|street|aerial|drone/i.test(i)),
    kitchen: images.filter(i => /kitchen/i.test(i)),
    living: images.filter(i => /living|family|great|main/i.test(i)),
    bedroom: images.filter(i => /bedroom|master|primary/i.test(i)),
    bathroom: images.filter(i => /bath/i.test(i)),
    other: [] as string[],
  };

  // Remaining images
  const usedUrls = new Set([
    ...categorized.exterior,
    ...categorized.kitchen,
    ...categorized.living,
    ...categorized.bedroom,
    ...categorized.bathroom,
  ]);
  categorized.other = images.filter(i => !usedUrls.has(i));

  // Combine in priority order with high-res conversion
  return [
    ...categorized.exterior.slice(0, 2),
    ...categorized.kitchen.slice(0, 2),
    ...categorized.living.slice(0, 2),
    ...categorized.bedroom.slice(0, 2),
    ...categorized.bathroom.slice(0, 1),
    ...categorized.other,
  ]
    .slice(0, count)
    .map(getHighResImage);
}

// Firecrawl Agent Mode for complex multi-step research
export async function runIntelligenceAgent(prompt: string, schema?: any) {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  
  // Note: Using fetch directly as the JS SDK might not support /agent yet
  const response = await fetch('https://api.firecrawl.dev/v1/agent', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt,
      schema,
      model: 'spark-1-pro' // Recommended for frontier accuracy
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Firecrawl Agent Error: ${err}`);
  }

  return response.json();
}
