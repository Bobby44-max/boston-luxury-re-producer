/**
 * Remotion Lambda Render Service
 *
 * Triggers video rendering on AWS Lambda and returns the output URL.
 */

import {
  renderMediaOnLambda,
  getRenderProgress,
  AwsRegion,
} from '@remotion/lambda/client';

// Configuration from environment
const getConfig = () => {
  const region = process.env.REMOTION_AWS_REGION as AwsRegion;
  const bucketName = process.env.REMOTION_BUCKET_NAME;
  const functionName = process.env.REMOTION_FUNCTION_NAME;
  const serveUrl = process.env.REMOTION_SERVE_URL;

  if (!region || !bucketName || !functionName || !serveUrl) {
    throw new Error(
      'Missing Remotion Lambda configuration. Required: REMOTION_AWS_REGION, REMOTION_BUCKET_NAME, REMOTION_FUNCTION_NAME, REMOTION_SERVE_URL'
    );
  }

  return { region, bucketName, functionName, serveUrl };
};

export interface PropertyVideoProps {
  // Property data
  address: string;
  city: string;
  state: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  description: string;
  features: string[];
  images: string[];

  // Script
  narration: string;
  scenes: Array<{
    start: number;
    end: number;
    text: string;
    visual: string;
  }>;

  // Voiceover
  voiceoverUrl?: string;

  // Branding
  agentName?: string;
  brokerageName?: string;
  phone?: string;
  logoUrl?: string;
  primaryColor?: string;
}

export interface RenderOptions {
  compositionId: 'PropertyShowcase' | 'SocialShort' | 'MarketStats' | 'JustListed';
  inputProps: PropertyVideoProps;
  durationInFrames?: number;
  fps?: number;
}

export interface RenderResult {
  renderId: string;
  bucketName: string;
  outputUrl: string;
}

/**
 * Start a video render on Lambda
 */
export async function startRender(options: RenderOptions): Promise<{ renderId: string }> {
  const config = getConfig();

  const { renderId } = await renderMediaOnLambda({
    region: config.region,
    functionName: config.functionName,
    serveUrl: config.serveUrl,
    composition: options.compositionId,
    inputProps: options.inputProps as unknown as Record<string, unknown>,
    codec: 'h264',
    imageFormat: 'jpeg',
    maxRetries: 1,
    framesPerLambda: 20,
    privacy: 'public',
    downloadBehavior: {
      type: 'download',
      fileName: `video-${Date.now()}.mp4`,
    },
  });

  return { renderId };
}

/**
 * Check render progress and get output URL when complete
 */
export async function checkRenderProgress(renderId: string): Promise<{
  done: boolean;
  progress: number;
  outputUrl?: string;
  error?: string;
}> {
  const config = getConfig();

  const progress = await getRenderProgress({
    renderId,
    bucketName: config.bucketName,
    functionName: config.functionName,
    region: config.region,
  });

  if (progress.fatalErrorEncountered) {
    return {
      done: true,
      progress: 0,
      error: progress.errors?.[0]?.message || 'Render failed',
    };
  }

  if (progress.done) {
    return {
      done: true,
      progress: 100,
      outputUrl: progress.outputFile ?? undefined,
    };
  }

  return {
    done: false,
    progress: Math.round((progress.overallProgress || 0) * 100),
  };
}

/**
 * Wait for render to complete (polling)
 */
export async function waitForRender(
  renderId: string,
  onProgress?: (progress: number) => void,
  maxWaitMs: number = 300000 // 5 minutes
): Promise<string> {
  const startTime = Date.now();
  const pollInterval = 2000; // 2 seconds

  while (Date.now() - startTime < maxWaitMs) {
    const status = await checkRenderProgress(renderId);

    if (onProgress) {
      onProgress(status.progress);
    }

    if (status.done) {
      if (status.error) {
        throw new Error(`Render failed: ${status.error}`);
      }
      if (status.outputUrl) {
        return status.outputUrl;
      }
      throw new Error('Render completed but no output URL');
    }

    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  throw new Error('Render timed out');
}

/**
 * Full render pipeline: start render, wait for completion, return URL
 */
export async function renderVideo(
  options: RenderOptions,
  onProgress?: (progress: number) => void
): Promise<string> {
  const { renderId } = await startRender(options);
  const outputUrl = await waitForRender(renderId, onProgress);
  return outputUrl;
}
