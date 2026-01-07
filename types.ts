
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

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export type ToolMode =
  | 'PRODUCER'
  | 'LIVE_CONSULTANT'
  | 'VEO_ANIMATOR'
  | 'CONTENT_SUITE'
  | 'COMPETITOR_IQ'
  | 'SALES_ACE'
  | 'SOCIAL_POSTS'
  | 'PROPOSALS';
