import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Img,
  Audio,
  Easing,
} from 'remotion';
import { z } from 'zod';

export const PropertyShowcaseSchema = z.object({
  address: z.string(),
  city: z.string(),
  state: z.string(),
  price: z.number(),
  bedrooms: z.number(),
  bathrooms: z.number(),
  sqft: z.number(),
  images: z.array(z.string()),
  features: z.array(z.string()),
  agentName: z.string(),
  agentTitle: z.string().optional(),
  agentPhoto: z.string().optional(),
  brokerageName: z.string(),
  logoUrl: z.string().optional(),
  phone: z.string(),
  email: z.string().optional(),
  voiceoverUrl: z.string().optional(),
  primaryColor: z.string().optional(),
});

type Props = z.infer<typeof PropertyShowcaseSchema>;

// Format price display
const formatPrice = (price: number) => {
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(1)}M`;
  }
  return `$${(price / 1000).toFixed(0)}K`;
};

// Gradient Background Component
const GradientBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const hue = interpolate(frame, [0, 900], [200, 260], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg,
          hsl(${hue}, 80%, 5%) 0%,
          hsl(${hue + 30}, 70%, 8%) 50%,
          hsl(${hue + 60}, 60%, 5%) 100%)`,
      }}
    />
  );
};

// Hero Scene Component
const HeroScene: React.FC<{
  address: string;
  city: string;
  state: string;
  price: number;
  image: string;
  primaryColor: string;
}> = ({ address, city, state, price, image, primaryColor }) => {
  const frame = useCurrentFrame();

  const imageScale = interpolate(frame, [0, 90], [1, 1.1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const textOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const textY = interpolate(frame, [20, 50], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const priceScale = interpolate(frame, [40, 70], [0.8, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      {/* Background Image with Ken Burns */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        {image && (
          <Img
            src={image}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${imageScale})`,
            }}
          />
        )}
        {/* Dark Overlay */}
        <AbsoluteFill
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%, rgba(0,0,0,0.3) 100%)',
          }}
        />
      </AbsoluteFill>

      {/* Price Badge */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          right: 60,
          opacity: textOpacity,
          transform: `scale(${priceScale})`,
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, #8b5cf6)`,
            padding: '20px 40px',
            borderRadius: 16,
            fontSize: 48,
            fontWeight: 800,
            color: 'white',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          {formatPrice(price)}
        </div>
      </div>

      {/* Address */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: 60,
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: 'white',
            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            marginBottom: 12,
          }}
        >
          {address}
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.8)',
          }}
        >
          {city}, {state}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Stats Scene Component
const StatsScene: React.FC<{
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  primaryColor: string;
}> = ({ bedrooms, bathrooms, sqft, primaryColor }) => {
  const frame = useCurrentFrame();

  const stats = [
    { value: bedrooms, label: 'Bedrooms', icon: '🛏️', delay: 0 },
    { value: bathrooms, label: 'Bathrooms', icon: '🛁', delay: 15 },
    { value: sqft.toLocaleString(), label: 'Sq Ft', icon: '📐', delay: 30 },
  ];

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 60,
      }}
    >
      {stats.map((stat, i) => {
        const progress = interpolate(
          frame,
          [stat.delay, stat.delay + 30],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        const scale = interpolate(progress, [0, 1], [0.5, 1], {
          easing: Easing.out(Easing.back(1.5)),
        });

        const countValue = typeof stat.value === 'number'
          ? Math.floor(interpolate(frame, [stat.delay, stat.delay + 45], [0, stat.value], {
              extrapolateRight: 'clamp',
            }))
          : stat.value;

        return (
          <div
            key={i}
            style={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 24,
              padding: '40px 50px',
              textAlign: 'center',
              opacity: progress,
              transform: `scale(${scale})`,
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>{stat.icon}</div>
            <div
              style={{
                fontSize: 72,
                fontWeight: 800,
                background: `linear-gradient(135deg, ${primaryColor}, #8b5cf6)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 8,
              }}
            >
              {countValue}
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.7)',
                textTransform: 'uppercase',
                letterSpacing: 2,
              }}
            >
              {stat.label}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Gallery Scene Component
const GalleryScene: React.FC<{ images: string[] }> = ({ images }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imageDuration = 2.5 * fps; // 2.5 seconds per image
  const imageIndex = Math.min(
    Math.floor(frame / imageDuration),
    images.length - 1
  );
  const imageProgress = (frame % imageDuration) / imageDuration;

  const currentImage = images[imageIndex] || '';

  const scale = interpolate(imageProgress, [0, 1], [1, 1.15], {
    easing: Easing.inOut(Easing.cubic),
  });

  const opacity = interpolate(
    imageProgress,
    [0, 0.1, 0.9, 1],
    [0, 1, 1, 0],
    { extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {currentImage && (
        <Img
          src={currentImage}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${scale})`,
            opacity,
          }}
        />
      )}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 30%)',
        }}
      />
    </AbsoluteFill>
  );
};

// Features Scene Component
const FeaturesScene: React.FC<{
  features: string[];
  primaryColor: string;
}> = ({ features, primaryColor }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 32,
          padding: 60,
          maxWidth: 1200,
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            letterSpacing: 4,
            marginBottom: 40,
          }}
        >
          Features
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 24,
          }}
        >
          {features.slice(0, 6).map((feature, i) => {
            const delay = i * 10;
            const opacity = interpolate(
              frame,
              [delay, delay + 20],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
            const x = interpolate(
              frame,
              [delay, delay + 20],
              [-30, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  opacity,
                  transform: `translateX(${x}px)`,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${primaryColor}, #8b5cf6)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                  }}
                >
                  ✓
                </div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 600,
                    color: 'white',
                  }}
                >
                  {feature}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// CTA Scene Component
const CTAScene: React.FC<{
  agentName: string;
  agentTitle?: string;
  agentPhoto?: string;
  brokerageName: string;
  logoUrl?: string;
  phone: string;
  primaryColor: string;
}> = ({ agentName, agentTitle, agentPhoto, brokerageName, logoUrl, phone, primaryColor }) => {
  const frame = useCurrentFrame();

  const scale = interpolate(frame, [0, 30], [0.8, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(1.2)),
  });

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 32,
          padding: 60,
          textAlign: 'center',
          minWidth: 600,
        }}
      >
        {/* Agent Photo */}
        {agentPhoto && (
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              overflow: 'hidden',
              margin: '0 auto 24px',
              border: `3px solid ${primaryColor}`,
            }}
          >
            <Img
              src={agentPhoto}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Agent Name */}
        <div
          style={{
            fontSize: 42,
            fontWeight: 700,
            color: 'white',
            marginBottom: 8,
          }}
        >
          {agentName}
        </div>

        {agentTitle && (
          <div
            style={{
              fontSize: 24,
              color: 'rgba(255,255,255,0.6)',
              marginBottom: 16,
            }}
          >
            {agentTitle}
          </div>
        )}

        <div
          style={{
            fontSize: 24,
            color: 'rgba(255,255,255,0.5)',
            marginBottom: 32,
          }}
        >
          {brokerageName}
        </div>

        {/* Phone */}
        <div
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, #8b5cf6)`,
            padding: '16px 40px',
            borderRadius: 12,
            fontSize: 32,
            fontWeight: 700,
            color: 'white',
            display: 'inline-block',
          }}
        >
          {phone}
        </div>

        {/* Schedule Text */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.7)',
            marginTop: 32,
          }}
        >
          Schedule Your Private Showing
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Main Component
export const PropertyShowcase: React.FC<Props> = (props) => {
  const primaryColor = props.primaryColor || '#0dccf2';

  return (
    <AbsoluteFill>
      <GradientBackground />

      {/* Scene 1: Hero - 0 to 3 seconds (frames 0-90) */}
      <Sequence from={0} durationInFrames={90}>
        <HeroScene
          address={props.address}
          city={props.city}
          state={props.state}
          price={props.price}
          image={props.images[0]}
          primaryColor={primaryColor}
        />
      </Sequence>

      {/* Scene 2: Stats - 3 to 7 seconds (frames 90-210) */}
      <Sequence from={90} durationInFrames={120}>
        <StatsScene
          bedrooms={props.bedrooms}
          bathrooms={props.bathrooms}
          sqft={props.sqft}
          primaryColor={primaryColor}
        />
      </Sequence>

      {/* Scene 3: Gallery - 7 to 20 seconds (frames 210-600) */}
      <Sequence from={210} durationInFrames={390}>
        <GalleryScene images={props.images.slice(1)} />
      </Sequence>

      {/* Scene 4: Features - 20 to 25 seconds (frames 600-750) */}
      <Sequence from={600} durationInFrames={150}>
        <FeaturesScene features={props.features} primaryColor={primaryColor} />
      </Sequence>

      {/* Scene 5: CTA - 25 to 30 seconds (frames 750-900) */}
      <Sequence from={750} durationInFrames={150}>
        <CTAScene
          agentName={props.agentName}
          agentTitle={props.agentTitle}
          agentPhoto={props.agentPhoto}
          brokerageName={props.brokerageName}
          logoUrl={props.logoUrl}
          phone={props.phone}
          primaryColor={primaryColor}
        />
      </Sequence>

      {/* Audio */}
      {props.voiceoverUrl && <Audio src={props.voiceoverUrl} volume={1} />}
    </AbsoluteFill>
  );
};
