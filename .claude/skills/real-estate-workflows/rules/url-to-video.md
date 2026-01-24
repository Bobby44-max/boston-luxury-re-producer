# URL to Video Workflow

## Complete Implementation

### Step 1: Receive Request
```typescript
// /app/api/video/generate/route.ts
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return unauthorized();

  const { listingUrl, videoType, options } = await request.json();

  // Create job in Convex
  const jobId = await convex.mutation(api.videos.createJob, {
    userId,
    listingUrl,
    videoType,
    status: 'pending',
    progress: 0,
    createdAt: Date.now(),
  });

  // Trigger async workflow
  await triggerWorkflow(jobId, listingUrl, videoType, options);

  return Response.json({ jobId, status: 'pending' });
}
```

### Step 2: Scrape Property Data
```typescript
async function scrapeProperty(jobId: string, url: string) {
  await updateJobStatus(jobId, 'scraping', 10);

  const firecrawl = new Firecrawl({
    apiKey: process.env.FIRECRAWL_API_KEY
  });

  const result = await firecrawl.extract({
    urls: [url],
    prompt: PROPERTY_EXTRACTION_PROMPT,
    schema: PropertySchema,
  });

  const propertyData = validatePropertyData(result.data);

  await updateJobProgress(jobId, {
    status: 'scraped',
    progress: 25,
    propertyData,
  });

  return propertyData;
}
```

### Step 3: Generate Script
```typescript
async function generateScript(
  jobId: string,
  propertyData: Property,
  videoType: string
) {
  await updateJobStatus(jobId, 'generating', 30);

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const prompt = buildScriptPrompt(propertyData, videoType);

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json',
    },
  });

  const script = JSON.parse(result.response.text());

  await updateJobProgress(jobId, {
    status: 'script_ready',
    progress: 45,
    script: script.narration,
  });

  return script;
}
```

### Step 4: Generate Voiceover (Optional)
```typescript
async function generateVoiceover(
  jobId: string,
  script: string,
  voice: string = 'alloy'
) {
  await updateJobStatus(jobId, 'voiceover', 50);

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const mp3 = await openai.audio.speech.create({
    model: 'tts-1-hd',
    voice,
    input: script,
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('voiceovers')
    .upload(`${jobId}.mp3`, buffer, {
      contentType: 'audio/mpeg',
    });

  const voiceoverUrl = supabase.storage
    .from('voiceovers')
    .getPublicUrl(`${jobId}.mp3`).data.publicUrl;

  await updateJobProgress(jobId, {
    status: 'voiceover_ready',
    progress: 60,
    voiceoverUrl,
  });

  return voiceoverUrl;
}
```

### Step 5: Render Video
```typescript
async function renderVideo(
  jobId: string,
  propertyData: Property,
  script: VideoScript,
  voiceoverUrl?: string,
  branding?: Branding
) {
  await updateJobStatus(jobId, 'rendering', 65);

  // Using Remotion Lambda for cloud rendering
  const { renderId, bucketName } = await renderMediaOnLambda({
    region: 'us-east-1',
    functionName: 'remotion-render',
    composition: getCompositionId(videoType),
    serveUrl: process.env.REMOTION_SERVE_URL,
    inputProps: {
      ...propertyData,
      script: script.narration,
      scenes: script.scenes,
      voiceoverUrl,
      ...branding,
    },
    codec: 'h264',
    maxRetries: 3,
    privacy: 'public',
  });

  // Poll for completion
  let progress = 65;
  while (true) {
    const status = await getRenderProgress({
      renderId,
      bucketName,
      functionName: 'remotion-render',
      region: 'us-east-1',
    });

    if (status.done) {
      await updateJobProgress(jobId, {
        status: 'complete',
        progress: 100,
        videoUrl: status.outputFile,
        thumbnailUrl: await generateThumbnail(status.outputFile),
        completedAt: Date.now(),
      });
      return status.outputFile;
    }

    if (status.fatalErrorEncountered) {
      throw new Error(status.errors.join(', '));
    }

    progress = Math.min(95, 65 + (status.overallProgress * 30));
    await updateJobProgress(jobId, { progress });
    await sleep(2000);
  }
}
```

### Step 6: Notify Completion
```typescript
async function notifyCompletion(jobId: string, job: VideoJob) {
  // Update Convex with final status
  await convex.mutation(api.videos.complete, {
    id: jobId,
    videoUrl: job.videoUrl,
    thumbnailUrl: job.thumbnailUrl,
  });

  // Send webhook if configured
  if (job.webhookUrl) {
    await fetch(job.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'video.complete',
        jobId,
        videoUrl: job.videoUrl,
        propertyAddress: job.propertyData.address,
      }),
    });
  }

  // Send email notification
  await sendEmail({
    to: job.userEmail,
    subject: `Your video for ${job.propertyData.address} is ready!`,
    template: 'video-complete',
    data: { job },
  });
}
```

## Error Recovery

```typescript
async function handleWorkflowError(jobId: string, error: Error, step: string) {
  console.error(`Workflow error at ${step}:`, error);

  // Update job with error
  await convex.mutation(api.videos.setError, {
    id: jobId,
    error: error.message,
    failedStep: step,
  });

  // Attempt recovery based on step
  switch (step) {
    case 'scrape':
      // Try fallback scraper
      return await scrapeWithFallback(jobId);
    case 'render':
      // Reduce quality and retry
      return await renderWithReducedQuality(jobId);
    default:
      // Mark as failed, notify user
      await notifyFailure(jobId, error);
  }
}
```

## Script Prompt Templates

### Property Showcase
```typescript
const SHOWCASE_PROMPT = `
Generate a video script for a luxury property showcase.

Property Details:
${JSON.stringify(propertyData, null, 2)}

Requirements:
1. 30-second script with 5 scenes
2. Opening hook mentioning price and location
3. Highlight top 3 features
4. Professional, aspirational tone
5. End with call-to-action

Return JSON:
{
  "narration": "Full voiceover script",
  "scenes": [
    { "start": 0, "end": 3, "text": "Hook text", "visual": "Exterior shot" },
    ...
  ]
}
`;
```

### Social Short
```typescript
const SOCIAL_PROMPT = `
Generate a 9-second TikTok/Reels script.

Property: ${propertyData.address}
Price: ${propertyData.price}
Stats: ${propertyData.bedrooms}BD/${propertyData.bathrooms}BA/${propertyData.sqft}SF

Requirements:
1. Punchy hook (2 seconds max)
2. 3 key stats with emojis
3. CTA for link in bio
4. Gen-Z friendly tone

Return JSON:
{
  "hookText": "Attention-grabbing text",
  "stats": ["🛏️ 4 Beds", "🛁 3 Baths", "📐 3,500 SF"],
  "cta": "Link in bio 👆"
}
`;
```
