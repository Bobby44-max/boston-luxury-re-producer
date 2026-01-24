import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Img,
  Easing,
  spring,
} from 'remotion';
import { z } from 'zod';

export const SocialShortSchema = z.object({
  address: z.string(),
  city: z.string(),
  neighborhood: z.string().optional(),
  price: z.number(),
  bedrooms: z.number(),
  bathrooms: z.number(),
  sqft: z.number(),
  heroImage: z.string(),
  hookText: z.string(),
  ctaText: z.string(),
  agentHandle: z.string().optional(),
  primaryColor: z.string().optional(),
});

type Props = z.infer<typeof SocialShortSchema>;

const formatPrice = (price: number) => {
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(1)}M`;
  }
  return `$${(price / 1000).toFixed(0)}K`;
};

// Hook Scene - First 2 seconds
const HookScene: React.FC<{
  hookText: string;
  price: number;
  heroImage: string;
  primaryColor: string;
}> = ({ hookText, price, heroImage, primaryColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imageScale = interpolate(frame, [0, 60], [1.3, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const textScale = spring({
    fps,
    frame: frame - 10,
    config: { damping: 200, stiffness: 100 },
  });

  const textOpacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const priceY = interpolate(frame, [25, 45], [50, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(1.5)),
  });

  const priceOpacity = interpolate(frame, [25, 40], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      {/* Background Image */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        {heroImage && (
          <Img
            src={heroImage}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${imageScale})`,
            }}
          />
        )}
        <AbsoluteFill
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
          }}
        />
      </AbsoluteFill>

      {/* Hook Text */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 60,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: 'white',
            textAlign: 'center',
            textShadow: '0 4px 30px rgba(0,0,0,0.8)',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            opacity: textOpacity,
            transform: `scale(${textScale})`,
          }}
        >
          {hookText}
        </div>

        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            marginTop: 40,
            opacity: priceOpacity,
            transform: `translateY(${priceY}px)`,
          }}
        >
          <span
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, #8b5cf6, #ec4899)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: 'none',
            }}
          >
            {formatPrice(price)}
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Stats Scene - 2 to 6 seconds
const StatsScene: React.FC<{
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  primaryColor: string;
}> = ({ bedrooms, bathrooms, sqft, primaryColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    { emoji: '🛏️', value: bedrooms, label: 'BEDS', delay: 0 },
    { emoji: '🛁', value: bathrooms, label: 'BATHS', delay: 20 },
    { emoji: '📐', value: sqft.toLocaleString(), label: 'SQ FT', delay: 40 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #09090b 0%, #1a1a2e 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
        padding: 60,
      }}
    >
      {stats.map((stat, i) => {
        const delay = stat.delay;
        const scaleSpring = spring({
          fps,
          frame: frame - delay,
          config: { damping: 200, stiffness: 200 },
        });

        const opacity = interpolate(frame, [delay, delay + 15], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        const slideY = interpolate(frame, [delay, delay + 20], [50, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        });

        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              opacity,
              transform: `translateY(${slideY}px) scale(${scaleSpring})`,
            }}
          >
            <div style={{ fontSize: 64 }}>{stat.emoji}</div>
            <div>
              <div
                style={{
                  fontSize: 96,
                  fontWeight: 900,
                  background: `linear-gradient(135deg, ${primaryColor}, #8b5cf6)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.6)',
                  letterSpacing: 4,
                }}
              >
                {stat.label}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// CTA Scene - 6 to 9 seconds
const CTAScene: React.FC<{
  ctaText: string;
  agentHandle?: string;
  primaryColor: string;
}> = ({ ctaText, agentHandle, primaryColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const containerScale = spring({
    fps,
    frame,
    config: { damping: 200, stiffness: 100 },
  });

  const buttonPulse = interpolate(
    frame % 30,
    [0, 15, 30],
    [1, 1.05, 1]
  );

  const arrowY = interpolate(
    frame % 20,
    [0, 10, 20],
    [0, -15, 0],
    { easing: Easing.inOut(Easing.cubic) }
  );

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #09090b 0%, #1a1a2e 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
        transform: `scale(${containerScale})`,
      }}
    >
      {/* Arrow */}
      <div
        style={{
          fontSize: 80,
          transform: `translateY(${arrowY}px)`,
        }}
      >
        👆
      </div>

      {/* CTA Button */}
      <div
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, #8b5cf6, #ec4899)`,
          padding: '24px 60px',
          borderRadius: 100,
          transform: `scale(${buttonPulse})`,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: 'white',
            textTransform: 'uppercase',
            letterSpacing: 2,
          }}
        >
          {ctaText}
        </div>
      </div>

      {/* Agent Handle */}
      {agentHandle && (
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.6)',
            marginTop: 20,
          }}
        >
          @{agentHandle}
        </div>
      )}
    </AbsoluteFill>
  );
};

// Main Component
export const SocialShort: React.FC<Props> = (props) => {
  const primaryColor = props.primaryColor || '#0dccf2';

  return (
    <AbsoluteFill style={{ background: '#09090b' }}>
      {/* Scene 1: Hook - 0 to 2 seconds (frames 0-60) */}
      <Sequence from={0} durationInFrames={60}>
        <HookScene
          hookText={props.hookText}
          price={props.price}
          heroImage={props.heroImage}
          primaryColor={primaryColor}
        />
      </Sequence>

      {/* Scene 2: Stats - 2 to 6 seconds (frames 60-180) */}
      <Sequence from={60} durationInFrames={120}>
        <StatsScene
          bedrooms={props.bedrooms}
          bathrooms={props.bathrooms}
          sqft={props.sqft}
          primaryColor={primaryColor}
        />
      </Sequence>

      {/* Scene 3: CTA - 6 to 9 seconds (frames 180-270) */}
      <Sequence from={180} durationInFrames={90}>
        <CTAScene
          ctaText={props.ctaText}
          agentHandle={props.agentHandle}
          primaryColor={primaryColor}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
