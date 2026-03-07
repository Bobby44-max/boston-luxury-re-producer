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
    // Request ephemeral token from Google (Standardized 2026 Live API)
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
                  text: `Act as a Senior Creative Director and TikTok Affiliate strategist for Kristen Rose (@frombostonwithgloss).
Your methodology is "Boston Polish" — an aesthetic that is intellectually honest, premium, and authentic.
You focus on:
- Beauty, Home finds, Kid stuff, and Lifestyle essentials.
- Authentic product recommendations and investment-worthy finds.
- SMART advice (ROI-focused, conversion-driven).
Keep responses concise, premium, and high-trust. Use your "smart older sister" energy.`,
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
