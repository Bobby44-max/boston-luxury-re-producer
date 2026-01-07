
export interface VideoPackage {
  title: string;
  script_text: string;
  visual_prompts: string[];
  caption: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export type ToolMode = 'PRODUCER' | 'LIVE_CONSULTANT' | 'IMAGE_EDITOR' | 'VEO_ANIMATOR';
