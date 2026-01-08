import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET(request: NextRequest) {
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

  const videoId = request.nextUrl.searchParams.get("videoId");
  if (!videoId) {
    return NextResponse.json(
      { success: false, error: "Video ID required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://api.heygen.com/v1/video_status.get?video_id=${videoId}`,
      {
        method: "GET",
        headers: {
          "X-Api-Key": apiKey,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("HeyGen status error:", data);
      return NextResponse.json(
        { success: false, error: data.message || "HeyGen API error" },
        { status: response.status }
      );
    }

    const status = data.data?.status;
    const videoUrl = data.data?.video_url;

    return NextResponse.json({
      success: true,
      status: status === "completed" ? "completed" : status === "failed" ? "failed" : "processing",
      videoUrl: videoUrl || null,
    });
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
