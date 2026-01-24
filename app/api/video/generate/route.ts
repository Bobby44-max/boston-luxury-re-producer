import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { scrapeProperty, selectBestImages } from '@/lib/services/firecrawl';
import { generateVideoScript } from '@/lib/services/gemini';
import { generateVoiceover, type VoiceId } from '@/lib/services/openai';
import { createClient } from '@supabase/supabase-js';

// Initialize clients
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface GenerateVideoRequest {
  listingUrl: string;
  videoType: 'property-showcase' | 'social-short' | 'market-stats' | 'just-listed';
  voiceoverEnabled?: boolean;
  voice?: VoiceId;
  branding?: {
    agentName?: string;
    agentTitle?: string;
    agentPhoto?: string;
    brokerageName?: string;
    logoUrl?: string;
    phone?: string;
    email?: string;
    primaryColor?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: GenerateVideoRequest = await request.json();
    const {
      listingUrl,
      videoType = 'property-showcase',
      voiceoverEnabled = true,
      voice = 'alloy',
      branding,
    } = body;

    if (!listingUrl) {
      return NextResponse.json({ error: 'listingUrl is required' }, { status: 400 });
    }

    // Create job in Convex
    const jobId = await convex.mutation(api.videos.createJob, {
      userId,
      listingUrl,
      videoType,
      branding,
    });

    // Start async processing (in production, use a queue like Inngest)
    processVideoGeneration(jobId.toString(), listingUrl, videoType, voiceoverEnabled, voice, branding, userId);

    return NextResponse.json({
      success: true,
      jobId: jobId.toString(),
      status: 'pending',
      message: 'Video generation started',
    });
  } catch (error) {
    console.error('Video generate API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to start video generation',
      },
      { status: 500 }
    );
  }
}

// Async processing function
async function processVideoGeneration(
  jobId: string,
  listingUrl: string,
  videoType: string,
  voiceoverEnabled: boolean,
  voice: VoiceId,
  branding: GenerateVideoRequest['branding'],
  userId: string
) {
  try {
    // Step 1: Scrape property data
    await convex.mutation(api.videos.updateProgress, {
      id: jobId as any,
      status: 'scraping',
      progress: 10,
    });

    const propertyData = await scrapeProperty(listingUrl);
    const bestImages = selectBestImages(propertyData.images, 10);

    await convex.mutation(api.videos.updateProgress, {
      id: jobId as any,
      status: 'scraped',
      progress: 25,
      propertyData: {
        ...propertyData,
        images: bestImages,
      },
    });

    // Step 2: Generate script
    await convex.mutation(api.videos.updateProgress, {
      id: jobId as any,
      status: 'generating',
      progress: 35,
    });

    const duration = videoType === 'social-short' ? 9 : 30;
    const script = await generateVideoScript(propertyData, {
      videoType,
      duration,
      voiceStyle: 'professional',
    });

    await convex.mutation(api.videos.updateProgress, {
      id: jobId as any,
      status: 'script_ready',
      progress: 50,
      script: script.narration,
      scenes: script.scenes,
    });

    // Step 3: Generate voiceover (optional)
    let voiceoverUrl: string | undefined;

    if (voiceoverEnabled) {
      await convex.mutation(api.videos.updateProgress, {
        id: jobId as any,
        status: 'voiceover',
        progress: 55,
      });

      const voiceoverBuffer = await generateVoiceover(script.narration, { voice });

      // Upload to Supabase Storage
      const filename = `${jobId}.mp3`;
      const { error: uploadError } = await supabase.storage
        .from('voiceovers')
        .upload(filename, voiceoverBuffer, {
          contentType: 'audio/mpeg',
          upsert: true,
        });

      if (uploadError) {
        console.error('Voiceover upload error:', uploadError);
      } else {
        const { data: urlData } = supabase.storage
          .from('voiceovers')
          .getPublicUrl(filename);
        voiceoverUrl = urlData.publicUrl;
      }

      await convex.mutation(api.videos.updateProgress, {
        id: jobId as any,
        status: 'voiceover_ready',
        progress: 65,
        voiceoverUrl,
      });
    }

    // Step 4: Render video with Remotion
    await convex.mutation(api.videos.updateProgress, {
      id: jobId as any,
      status: 'rendering',
      progress: 70,
    });

    // In production, trigger Remotion Lambda here
    // For now, we'll simulate the render completion
    // const videoUrl = await renderWithRemotion({ ... });

    // Simulate render completion (replace with actual Remotion integration)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mark as complete with placeholder URL
    await convex.mutation(api.videos.complete, {
      id: jobId as any,
      videoUrl: `https://storage.example.com/videos/${jobId}.mp4`,
      thumbnailUrl: bestImages[0],
      duration,
    });

  } catch (error) {
    console.error('Video processing error:', error);
    await convex.mutation(api.videos.setError, {
      id: jobId as any,
      error: error instanceof Error ? error.message : 'Processing failed',
    });
  }
}
