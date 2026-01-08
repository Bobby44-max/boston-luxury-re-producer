import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function POST(request: NextRequest) {
  // Check authentication
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "HeyGen API key not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { script, avatarId, voiceId } = body;

    if (!script || !avatarId || !voiceId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create video via HeyGen API
    const response = await fetch("https://api.heygen.com/v2/video/generate", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        video_inputs: [
          {
            character: {
              type: "avatar",
              avatar_id: avatarId,
              avatar_style: "normal",
            },
            voice: {
              type: "text",
              input_text: script,
              voice_id: voiceId,
            },
          },
        ],
        dimension: {
          width: 1280,
          height: 720,
        },
        aspect_ratio: "16:9",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("HeyGen API error:", data);
      return NextResponse.json(
        { success: false, error: data.message || "HeyGen API error" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      videoId: data.data?.video_id,
    });
  } catch (error) {
    console.error("Avatar generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
