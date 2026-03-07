import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  scrapeProperty,
  scrapeInsights,
  scrapeAdvanced,
  runIntelligenceAgent,
} from '@/lib/services/firecrawl';
import { runGEOAudit, extractDesignDNA } from '@/lib/services/gemini';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { url, type = 'property', prompt, schema } = body;

    if (!url && type !== 'agent-research') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Handle different intelligence types
    let result: unknown;

    switch (type) {
      case 'property':
        result = await scrapeProperty(url);
        break;

      case 'insights':
        result = await scrapeInsights(url);
        break;

      case 'geo-audit': {
        const scrape = await scrapeAdvanced(url, { formats: ['markdown'] });
        result = await runGEOAudit(url, scrape.markdown || '');
        break;
      }

      case 'design-dna': {
        // Scrape markdown + screenshot, then pass to Gemini for design extraction
        const scrape = await scrapeAdvanced(url, { formats: ['markdown', 'screenshot'] });
        result = await extractDesignDNA(url, { markdown: scrape.markdown, screenshot: scrape.screenshot });
        break;
      }

      case 'agent-research': {
        if (!prompt) return NextResponse.json({ error: 'Prompt required for agent' }, { status: 400 });
        result = await runIntelligenceAgent(prompt, schema);
        break;
      }

      default:
        return NextResponse.json({ error: 'Invalid intelligence type' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      type,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Scrape API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process intelligence request',
      },
      { status: 500 }
    );
  }
}
