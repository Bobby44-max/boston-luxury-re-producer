import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { scrapeProperty, selectBestImages } from '@/lib/services/firecrawl';
import { generateVideoScript } from '@/lib/services/gemini';
import { generateVoiceover, type VoiceId } from '@/lib/services/openai';
import { createClient } from '@supabase/supabase-js';
import { renderVideo, type RenderOptions } from '@/lib/services/remotion-lambda';

// Lazy initialization to avoid build-time errors
function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_CONVEX_URL is not configured');
  }
  return new ConvexHttpClient(url);
}

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Supabase credentials not configured');
  }
  return createClient(url, key);
}

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
    const convex = getConvexClient();
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
  const convex = getConvexClient();
  const supabase = getSupabaseClient();

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

    // Step 4: Render video with Remotion Lambda
    await convex.mutation(api.videos.updateProgress, {
      id: jobId as any,
      status: 'rendering',
      progress: 70,
    });

    // Map video type to Remotion composition
    const compositionMap: Record<string, RenderOptions['compositionId']> = {
      'property-showcase': 'PropertyShowcase',
      'social-short': 'SocialShort',
      'market-stats': 'MarketStats',
      'just-listed': 'JustListed',
    };

    // Render with Remotion Lambda
    const videoUrl = await renderVideo(
      {
        compositionId: compositionMap[videoType] || 'PropertyShowcase',
        inputProps: {
          address: propertyData.address,
          city: propertyData.city,
          state: propertyData.state,
          price: propertyData.price,
          bedrooms: propertyData.bedrooms,
          bathrooms: propertyData.bathrooms,
          sqft: propertyData.sqft,
          description: propertyData.description,
          features: propertyData.features,
          images: bestImages,
          narration: script.narration,
          scenes: script.scenes,
          voiceoverUrl,
          agentName: branding?.agentName,
          brokerageName: branding?.brokerageName,
          phone: branding?.phone,
          logoUrl: branding?.logoUrl,
          primaryColor: branding?.primaryColor,
        },
      },
      async (progress) => {
        // Update progress during render (70-95%)
        const renderProgress = 70 + Math.round(progress * 0.25);
        await convex.mutation(api.videos.updateProgress, {
          id: jobId as any,
          status: 'rendering',
          progress: renderProgress,
        });
      }
    );

    // Mark as complete with actual video URL
    await convex.mutation(api.videos.complete, {
      id: jobId as any,
      videoUrl,
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
