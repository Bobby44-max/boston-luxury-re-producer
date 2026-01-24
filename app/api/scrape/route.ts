import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { scrapeProperty, scrapeInsights, type Property, type Insights } from '@/lib/services/firecrawl';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { url, type = 'property' } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    let data: Property | Insights;

    if (type === 'property') {
      data = await scrapeProperty(url);
    } else if (type === 'insights') {
      data = await scrapeInsights(url);
    } else {
      return NextResponse.json({ error: 'Invalid type. Use "property" or "insights"' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data,
      scrapedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Scrape API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to scrape URL',
      },
      { status: 500 }
    );
  }
}
