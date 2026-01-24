import OpenAI from 'openai';

// Initialize OpenAI client
export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }
  return new OpenAI({ apiKey });
}

export type VoiceId = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

export interface VoiceoverOptions {
  voice?: VoiceId;
  speed?: number; // 0.25 to 4.0
  model?: 'tts-1' | 'tts-1-hd';
}

// Generate voiceover from text
export async function generateVoiceover(
  text: string,
  options: VoiceoverOptions = {}
): Promise<Buffer> {
  const openai = getOpenAIClient();

  const {
    voice = 'alloy',
    speed = 1.0,
    model = 'tts-1-hd',
  } = options;

  const mp3 = await openai.audio.speech.create({
    model,
    voice,
    input: text,
    speed,
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  return buffer;
}

// Voice descriptions for UI
export const VOICES = {
  alloy: { name: 'Alloy', description: 'Neutral and balanced' },
  echo: { name: 'Echo', description: 'Warm and conversational' },
  fable: { name: 'Fable', description: 'British and expressive' },
  onyx: { name: 'Onyx', description: 'Deep and authoritative' },
  nova: { name: 'Nova', description: 'Friendly and energetic' },
  shimmer: { name: 'Shimmer', description: 'Clear and professional' },
} as const;

// Estimate voiceover duration (rough calculation)
export function estimateVoiceoverDuration(text: string, speed: number = 1.0): number {
  // Average speaking rate: ~150 words per minute
  const words = text.split(/\s+/).length;
  const minutes = words / 150;
  const seconds = (minutes * 60) / speed;
  return Math.ceil(seconds);
}
