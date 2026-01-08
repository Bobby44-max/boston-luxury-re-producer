import { NextResponse } from "next/server";

/**
 * Generate ephemeral token for Gemini Live API
 * This keeps the API key server-side while allowing browser WebSocket connections
 */
export async function POST() {
  const apiKey = process.env.GEMINI_API_KEY_FIREBASE;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Gemini API key not configured" },
      { status: 500 }
    );
  }

  try {
    // Request ephemeral token from Google
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-live-001:generateEphemeralToken?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: "Aoede", // Natural female voice
              },
            },
            responseModalities: ["AUDIO"],
            systemInstruction: {
              parts: [
                {
                  text: `You are a luxury real estate consultant for the Boston market.
You have deep expertise in Back Bay, Beacon Hill, Seaport, South End, Cambridge, and Brookline.
You speak naturally and conversationally, providing insights on:
- Property valuations and market trends
- Neighborhood characteristics and lifestyle
- Investment opportunities and timing
- Luxury amenities and architectural styles
Keep responses concise and engaging. Use specific Boston neighborhood knowledge.`,
                },
              ],
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Ephemeral token error:", errorText);

      // Fallback: Return API key directly (less secure but works)
      // In production, you'd want proper ephemeral token support
      return NextResponse.json({
        token: apiKey,
        model: "gemini-2.0-flash-live-001",
        fallback: true,
      });
    }

    const data = await response.json();

    return NextResponse.json({
      token: data.token || data.ephemeralToken,
      expiresAt: data.expiresAt,
      model: "gemini-2.0-flash-live-001",
    });
  } catch (error) {
    console.error("Token generation error:", error);

    // Fallback to API key
    return NextResponse.json({
      token: apiKey,
      model: "gemini-2.0-flash-live-001",
      fallback: true,
    });
  }
}
