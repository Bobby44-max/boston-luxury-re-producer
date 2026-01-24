export interface VideoPackage {
  title: string;
  script_text: string;
  visual_prompts: string[];
  caption: string;
}

export interface ContentSuiteResult {
  videoScript: string;
  slideDeck: string;
  infographic: string;
  podcastScript: string;
  quizQuestions: string[];
  dataTable: string;
}

export interface CompetitorIQResult {
  strengthsWeaknesses: string;
  pricingAnalysis: string;
  messagingAnalysis: string;
  counterPositioning: string;
  battleCard: string;
}

export interface SalesAceResult {
  objectionFrameworks: string;
  competitorBattlecard: string;
  voicemailScripts: string;
  rolePlayScenarios: string;
  quickReferenceCard: string;
}

export interface SocialPostResult {
  videoScript: string;
  geminiPrompt: string;
  linkedinPost: string;
  characterCount: number;
}

export interface ProposalResult {
  executiveSummary: string;
  problemStatement: string;
  scopeOfWork: string;
  timeline: string;
  investmentBreakdown: string;
  nextSteps: string;
}

// Property data from Firecrawl
export interface PropertyData {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lotSize?: string;
  yearBuilt?: number;
  propertyType: string;
  description: string;
  features: string[];
  images: string[];
  neighborhood?: string;
  agent?: {
    name: string;
    phone?: string;
    email?: string;
    brokerage?: string;
  };
}

// Video generation job
export interface VideoJob {
  id: string;
  userId: string;
  listingUrl: string;
  videoType: string;
  status: 'pending' | 'scraping' | 'generating' | 'rendering' | 'complete' | 'failed';
  progress: number;
  propertyData?: PropertyData;
  script?: string;
  scenes?: VideoScene[];
  voiceoverUrl?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  error?: string;
  branding?: BrandingConfig;
  createdAt: number;
  completedAt?: number;
}

export interface VideoScene {
  start: number;
  end: number;
  text: string;
  visual: string;
}

export interface BrandingConfig {
  agentName?: string;
  agentTitle?: string;
  agentPhoto?: string;
  brokerageName?: string;
  logoUrl?: string;
  phone?: string;
  email?: string;
  primaryColor?: string;
}

// AI-extracted insights
export interface Insights {
  brandingStrategies?: { value: string }[];
  seoKeywords?: { value: string }[];
  aeoGeoOptimizationTactics?: { value: string }[];
  uiUxPatterns?: { value: string }[];
}

// Using string union type for client-side compatibility
export type AppStatus = "IDLE" | "LOADING" | "SUCCESS" | "ERROR";

export type ToolMode =
  | "PRODUCER"
  | "LIVE_CONSULTANT"
  | "VEO_ANIMATOR"
  | "CONTENT_SUITE"
  | "COMPETITOR_IQ"
  | "SALES_ACE"
  | "SOCIAL_POSTS"
  | "PROPOSALS"
  | "VIDEO_STUDIO";

export type VideoType =
  | "property-showcase"
  | "social-short"
  | "market-stats"
  | "just-listed"
  | "neighborhood-tour"
  | "testimonial"
  | "open-house"
  | "price-drop";

export interface GenerationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
